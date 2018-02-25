'use strict';
const $ = require('jquery');
const Tone = require('tone');

const DataFactory = require('./dataFactory');
const AuthFactory = require('./authFactory');
const view = require('./view');
const eduCtrl = require('./edu-control');
const eduView = require('./edu-view');
const osc = require('./osc.js');

let currentUser = null;
let editBool = false;


module.exports.checkUser = uid => {
    currentUser = uid;
    return currentUser;
};


$(document).on("click", "#login", ()=>{
    AuthFactory.authUser()
    .then(account=>currentUser=account.user.uid);  
});

$(document).on("click", "#logout", () => AuthFactory.logout());


let allNotes = ['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5'];
let allKeyCodes = [65,87,83,69,68,70,84,71,89,72,85,74,75,79,76,80,186,222];
let allKeys = ["a","w","s","e","d","f","t","g","y","h","u","j","k","o","l","p",";","'"];


//sets id for each piano key for UI coloring 
let keyboard = $("#keyMap").children();

for (let i=0;i<keyboard.length;i++) {
    keyboard[i].id = `key${allKeyCodes[i]}`;
}


//Tone Js Synth created on page load:  plays 6 notes at a time
let synth = new Tone.PolySynth(6, Tone.MonoSynth);

//applies all values of patch passed into the argument to the inputs of the synth
//triggers change at the end of function to initiate patch  
function applyPatch(patch) {
    let params = Object.keys(patch);
    console.log(patch);
    params.forEach(i => {
        if (i === "osc") {
            $(`#synthWrap :input:radio[name=${i}][id=${patch[i]}]`).prop('checked', true);
        } else if (i === "detune") {
            $(`#synthWrap :input:radio[name=${i}][value=${patch[i]}]`).prop('checked', true);
        } else {
            $(`#synthWrap :input#${i}`).val(patch[i]);
        }
    });
    $("#synthWrap").trigger("change");
}

// receives patch created in SynthBuilder
module.exports.receivePatch = (patch) => {
    applyPatch(patch);
};


// detects any change made on #synthWrap inputs and adjusts object values of Tone.PolySynth
$("#synthWrap").on("change", function(){
    synth.set({
        detune: $("input[name='detune']:checked").val(),
        oscillator: {
            type: $("input[name='osc']:checked").val()
        },
        filter: {
            Q: $("#filterQ").val(),
            type: 'lowpass',
            rolloff: -24
        },
        envelope: {
            attack: $("#ampAttack").val(),
            decay: $("#ampDecay").val(),
            sustain: $("#ampSustain").val(),
            release: $("#ampRelease").val()
        },
        filterEnvelope: {
            attack: $("#filterAttack").val(),
            decay: $("#filterDecay").val(),
            sustain: $("#filterSustain").val(),
            release: $("#filterRelease").val(),
            baseFrequency: $("#filterFreq").val(),
            octaves: 3,
            exponent: 2
        }
    });
    
});

//connects synth to main audio output
synth.toMaster();

//synth volume control event listener
$("#synthVol").on("change", () => {
    synth.toMaster().volume.value = $("#synthVol").val();
});

//initialize settings on load
$("#synthWrap").trigger("change");


// keydown: loops through all notes on keydown
$(document).on("keydown", function (e) {
    for (let i = 0; i < allNotes.length; i++) {
        //stops bubbling of event if text input focused or SynthBuilder open
        if ($("input[type=text]").is(":focus") || $('#eduModal').css('display') == 'block') {
            e.stopPropagation();
        }
        // matches non-repeating key event (prevents multiple sounds of same key) 
        // colors coresponding key on piano
        // plays note
        else if (e.key == allKeys[i] && !e.originalEvent.repeat) {
            if ($(`#key${allKeyCodes[i]}`).hasClass("flat")){
                $(`#key${allKeyCodes[i]}`).addClass("keyFillFlat");
            } else {
                $(`#key${allKeyCodes[i]}`).addClass("keyFill");
            }
            synth.triggerAttack(allNotes[i]);
        }
    }
});

// keyup removes key color and ends note played
$(document).on("keyup", function (e) {
    for (let i = 0; i < allNotes.length; i++) {
        if (e.key == allKeys[i]) {
            $(`#key${allKeyCodes[i]}`).removeClass("keyFill");
            $(`#key${allKeyCodes[i]}`).removeClass("keyFillFlat");
            synth.triggerRelease(allNotes[i]);
        }
    }
});


/// show/hide coordinating key presses to piano
$("#showKeys").on("change", function(){
    if ($("#showKeys").is(":checked")){
        $("#keyMap>div>span").show();
    } else {
        $("#keyMap>div>span").hide();
    }
});


$("#showKeys").trigger("change");

/// dropdown menu listener
$(document).on("click", "#dropdown", ()=>{ 
    if ($("#patchDrop").css("display") == "none") {
        $("#patchDrop").css("display", "block");
    } else {
        $("#patchDrop").css("display", "none");
    }
});

// 
$(document).on("click", (e) => {
    if ($("#patchDrop").css("display") === "block" && e.target.id !== "dropdown") {
        $("#patchDrop").css("display", "none");
    }
});


/// load user patch from firebase & apply params to synth
$(document).on("click", "#patchDrop", function(e){
    DataFactory.loadPatch(e.target.id)
    .then(patch=>applyPatch(patch))
    .then($(this).css("display", "none"));
}); 

/// load prebuilt patch for non-registered users & apply params to synth
$("#patchBtns :input:radio").change(function(){
    let pID = $("#patchBtns :input:radio:checked").attr('id');
    DataFactory.setPatch()
    .then((patches)=>{
        applyPatch(patches[pID]);
        $("#synthWrap").trigger("change");
    });
});




///display modals - event listeners
/////////////////////////////
$(document).on("click", "#promptLogin", function(){
    AuthFactory.authUser()
        .then(account => currentUser = account.user.uid)
        .then($(this).parent().parent().hide());  
});

$(document).on("click", "#callSave", () => view.saveView());

$(document).on("click", "#callEdit", () => {
    DataFactory.getPatches(currentUser)
    .then(patches=>{
        view.editView(patches);
    });
});

// calls delete from 'x' in patch dropdown next to patch name
$(document).on("click", ".deleteChip", function () {
    view.deleteView($(this).prev().attr("id"), $(this).prev().text());
});

// closes all modals with no data changes (cancels action)
$(document).on("click", ".closeChip", function () {
    $(this).parent().parent().fadeOut(100);
});



///modal-to-data interactions
/////////////////////////////
$(document).on("click", "#savePatch", function() {
    let obj = {};
    obj.patch_name = $("#newPatch").val();
    obj.uid = currentUser;
    $("#synthWrap :input:radio:checked").each(function(set){
        obj[this.name] = this.value;
    });
    $("#synthWrap :input[type=range]").each(function (set) {
        obj[this.id] = this.value;
    });
    DataFactory.savePatch(obj)
        .then(() => {
            view.leaveModal(obj.patch_name, editBool);
            DataFactory.getPatches(currentUser)
                .then(userPatches => view.userAuth(userPatches));
        });
});

//if box is checked, enables edit modal text input
$(document).on('click', '#changeName', ()=>{
    if ($('#changeName').is(':checked')) {
        $('#newName').prop('disabled', false).focus();
    } else {
        $('#newName').prop('disabled', true).val("");
    }
});

$(document).on("click", "#editPatch", function () {
    let patchKey = $("#patchOver").val();
    let obj = {};
    if ($('#changeName').is(':checked') && $('#newName').val() !==""){
        obj.patch_name = $('#newName').val();
    } else {
        obj.patch_name = $("#patchOver option:selected").text();
    }
    obj.uid = currentUser;
    $("#synthWrap :input:radio:checked").each(function (set) {
        obj[this.name] = this.value;
    });
    $("#synthWrap :input[type=range]").each(function (set) {
        obj[this.id] = this.value;
    });
    DataFactory.overwritePatch(patchKey, obj)
        .then(patch => {
            view.leaveModal(patch.patch_name, editBool);
            DataFactory.getPatches(currentUser)
                .then(userPatches => view.userAuth(userPatches));
        });
});


$(document).on("click", "#deletePatch", function () {
    let erasePatch = $(this).prev().attr("patch_id");
    let deletedPatch = $("#toDelete").text();
    let deleteBool = true;
    DataFactory.deletePatch(erasePatch)
        .then(() => {
            view.leaveModal(deletedPatch, deleteBool);
            $(`#${erasePatch}`).parent().remove();
        });
});



