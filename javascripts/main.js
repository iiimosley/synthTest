'use strict';
const $ = require('jquery');
const Tone = require('tone');
const model = require('./model');
const view = require('./view');


let allNotes = ['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5'];
let allKeys = [65,87,83,69,68,70,84,71,89,72,85,74,75,79,76,80,186,222];

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
            synth.triggerAttack(allNotes[i]);
        }
    }
});

$(document).on("keyup", function () {
    for (let i = 0; i < allNotes.length; i++) {
        if (event.keyCode == allKeys[i]) {
            synth.triggerRelease(allNotes[i]);
        }
    }
});

$("#patchBtns :input:radio").change(function(){
    let pID = $("#patchBtns :input:radio:checked").attr('id');
    model.setPatch()
    .then((patches)=>{
        applyPatch(patches[pID]);
        $("#synthWrap").trigger("change");
    });
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
//     model.setPatch(obj, $("#patchBtns :input:radio:checked").attr('id'));
// });

