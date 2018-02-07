'use strict';
const $ = require('jquery');
const Tone = require('tone');
const DataFactory = require('./dataFactory');
const view = require('./view');
const AuthFactory = require('./authFactory');
let currentUser = null;

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
let allKeys = [65,87,83,69,68,70,84,71,89,72,85,74,75,79,76,80,186,222];

let keyboard = $("#keyMap").children();

for (let i=0;i<keyboard.length;i++) {
    keyboard[i].id = `key${allKeys[i]}`;
}

let synth = new Tone.PolySynth(6, Tone.MonoSynth);

function applyPatch(patch) {
    let params = Object.keys(patch);
    params.forEach(i => {
        if (i === "osc" || i === "detune") {
            $(`#synthWrap :input:radio[name=${i}][id=${patch[i]}]`).prop('checked', true);
        } else {
            $(`#synthWrap :input#${i}`).val(patch[i]);
        }
    });
    $("#synthWrap").trigger("change");
}

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
synth.toMaster();


$(document).on("keydown", function () {
    for (let i = 0; i < allNotes.length; i++) {
        if (event.keyCode == allKeys[i] && !event.repeat) {
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


$("#showKeys").on("change", function(){
    if ($("#showKeys").is(":checked")){
        $("#keyMap>div>span").show();
    } else {
        $("#keyMap>div>span").hide();
    }
});

$(document).on("click", "#patchDrop", function(){
    DataFactory.loadPatch(event.target.id)
    .then(patch=>applyPatch(patch));
}); 

$("#patchBtns :input:radio").change(function(){
    let pID = $("#patchBtns :input:radio:checked").attr('id');
    DataFactory.setPatch()
    .then((patches)=>{
        applyPatch(patches[pID]);
        $("#synthWrap").trigger("change");
    });
});


///modal view event listeners

$(document).on("click", "#callSave", () => view.saveView());

$(document).on("click", "#callEdit", () => {
    DataFactory.getPatches(currentUser)
    .then(patches=>{
        view.editView(patches);
    });
});

$(document).on("click", ".deleteChip", function () {
    view.deleteView($(this).parent().attr("id"), $(this).prev().text());
});

$(document).on("click", ".closeChip", function () {
    $(this).parent().parent().hide();
});



///modal-to-data interactions
$(document).on("click", "#savePatch", function() {
    let obj = {};
    obj.patch_name = $("#newPatch").val();
    obj.uid = currentUser;
    $("#synthWrap :input:radio:checked").each(function(set){
        console.log(set, this.name, this.value);
        obj[this.name] = this.value;
    });
    $("#synthWrap :input[type=range]").each(function (set) {
        console.log(set, this.id, this.value);
        obj[this.id] = this.value;
    });
    console.log(obj);
    DataFactory.savePatch(obj)
        .then(() => {
            view.leaveModal(obj.patch_name);
        });
});


$(document).on("click", "#editPatch", function () {
    let patchKey = $("#patchOver").val();
    let obj = {};
    obj.patch_name = $("#patchOver option:selected").text();
    obj.uid = currentUser;
    $("#synthWrap :input:radio:checked").each(function (set) {
        console.log(set, this.name, this.value);
        obj[this.name] = this.value;
    });
    $("#synthWrap :input[type=range]").each(function (set) {
        console.log(set, this.id, this.value);
        obj[this.id] = this.value;
    });
    console.log(patchKey, obj);
    DataFactory.overwritePatch(patchKey, obj)
        .then(patch => {
            view.leaveModal(patch.patch_name);
        });
});


$(document).on("click", "#deletePatch", function () {
    console.log("patch to delete", $(this).prev().attr("patch_id"));
});












// $("#getVals").on("click", function(){
//     let obj = {};
//     $("#synthWrap :input:radio:checked").each(function(set){
//         console.log(set, this.name, this.value);
//         obj[this.name] = this.value;
//     });
//     $("#synthWrap :input[type=range]").each(function (set) {
//         console.log(set, this.id, this.value);
//         obj[this.id] = this.value;
//     });
//     console.log(obj, $("#patchBtns :input:radio:checked").attr('id'));
//     DataFactory.setPatch(obj, $("#patchBtns :input:radio:checked").attr('id'));
// });

