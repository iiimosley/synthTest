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

//firefox dependency for vertically aligned range inputs
// $("input[type=range]").attr('orient', 'vertical');


$(document).on("click", "#login", ()=>{
    AuthFactory.authUser()
    .then(account=>currentUser=account.user.uid);  
});

$(document).on("click", "#logout", () => AuthFactory.logout());



let allNotes = ['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5'];
let allKeys = [65,87,83,69,68,70,84,71,89,72,85,74,75,79,76,80,186,222];

let keyboard = $("#keyMap").children();

for (let i=0;i<keyboard.length;i++) {
    keyboard[i].id = `key${allKeys[i]}`;
}

let synth = new Tone.PolySynth(6, Tone.MonoSynth);


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

module.exports.receivePatch = (patch) => {
    applyPatch(patch);
};



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

$("#synthVol").on("change", ()=> synth.volume.value = $("#synthVol").val());

//initialize settings on load
$("#synthWrap").trigger("change");

synth.toMaster();

$(document).on("keydown", function (e) {
    for (let i = 0; i < allNotes.length; i++) {
        if ($("input[type=text]").is(":focus") || $('#eduModal').css('display') == 'block') {
            e.stopPropagation();
        }
        else if (event.keyCode == allKeys[i] && !event.repeat) {
            if ($(`#key${allKeys[i]}`).hasClass("flat")){
                $(`#key${allKeys[i]}`).addClass("keyFillFlat");
            } else {
                $(`#key${allKeys[i]}`).addClass("keyFill");
            }
            synth.triggerAttack(allNotes[i]);
        }
    }
});

$(document).on("keyup", function () {
    for (let i = 0; i < allNotes.length; i++) {
        if (event.keyCode == allKeys[i]) {
            $(`#key${allKeys[i]}`).removeClass("keyFill");
            $(`#key${allKeys[i]}`).removeClass("keyFillFlat");
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


/// dropdown menu listener
$(document).on("click", "#dropdown", ()=>{ 
    if ($("#patchDrop").css("display") == "none") {
        $("#patchDrop").css("display", "block");
    } else {
        $("#patchDrop").css("display", "none");
    }
});

// $(document).on("click", (e)=>{
//     if (e.currentTarget !== $("#dropdown") && $("#patchDrop").css("display") == "block") {
//         $("#patchDrop").css("display", "none");
//     }
// });


/// load user patch from firebase & apply params to synth
$(document).on("click", "#patchDrop", function(){
    DataFactory.loadPatch(event.target.id)
    .then(patch=>applyPatch(patch));
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




///display modal event listeners
/////////////////////////////
$(document).on("click", "#callSave", () => view.saveView());

$(document).on("click", "#callEdit", () => {
    DataFactory.getPatches(currentUser)
    .then(patches=>{
        view.editView(patches);
    });
});

$(document).on("click", ".deleteChip", function () {
    view.deleteView($(this).prev().attr("id"), $(this).prev().text());
});

$(document).on("click", ".closeChip", function () {
    $(this).parent().parent().hide();
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
    console.log(obj);
    DataFactory.savePatch(obj)
        .then(() => {
            view.leaveModal(obj.patch_name, editBool);
            DataFactory.getPatches(currentUser)
                .then(userPatches => view.userAuth(userPatches));
        });
});


$(document).on('click', '#changeName', ()=>{
    if ($('#changeName').is(':checked')) {
        console.log('getting it');
        $('#newName').prop('disabled', false).focus();
    } else {
        $('#newName').prop('disabled', true);
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
    console.log(patchKey, obj);
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



