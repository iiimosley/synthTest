'use strict';

const $ = require('jquery');
const Tone = require('tone');
const eduView = require('./edu-view');

$(document).on('click', '#startBuild', ()=> eduView.startBuild());


/// synth for builder + params
let eduParams = {
    frequency: 'A4',
    detune: 0,
    oscillator: {
        type: 'sine'
    },
    filter: {
        Q: 1,
        type: 'lowpass',
        rolloff: -24
    },
    envelope: {
        attack: 0.005,
        decay: 1,
        sustain: 1,
        release: 0
    },
    filterEnvelope: {
        attack: 0,
        decay: 0,
        sustain: 0,
        release: 0,
        baseFrequency: 5000,
        octaves: 7,
        exponent: 2
    }
};

let eduSynth = new Tone.MonoSynth(eduParams);


//oscillators
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new window.AudioContext();
let g = audioCtx.createGain();

let sineWave = audioCtx.createOscillator();
let squareWave = audioCtx.createOscillator();
let triangleWave = audioCtx.createOscillator();
let sawtoothWave = audioCtx.createOscillator();

sineWave.type = 'sine';
squareWave.type = 'square';
triangleWave.type = 'triangle';
sawtoothWave.type = 'sawtooth';

let waves = [sineWave, squareWave, triangleWave, sawtoothWave];

// waves.forEach(wave=>{
//     console.log(wave);
// });


sineWave.frequency.setValueAtTime(440, audioCtx.currentTime);
squareWave.frequency.setValueAtTime(440, audioCtx.currentTime);
triangleWave.frequency.setValueAtTime(440, audioCtx.currentTime);
sawtoothWave.frequency.setValueAtTime(440, audioCtx.currentTime);

sineWave.start(0);
squareWave.start(0);
triangleWave.start(0);
sawtoothWave.start(0);

//adds class to osc selected + calls to print details
function selectOsc(wave) {
    wave.addClass('oscSelect');
    $('#oscView>aside>div').not(wave).removeClass('oscSelect');
    eduView.printOscDetail($('.oscSelect').attr('wave'));
}

// oscillator listeners
$(document).on('mousedown', '#startSine', function() {
    sineWave.connect(audioCtx.destination);
    selectOsc($('#startSine').parent());
});
$(document).on('mouseup mouseleave', "#startSine", () => sineWave.disconnect());


$(document).on('mousedown', "#startSquare", () => {
    g.gain.value = 0.3;
    squareWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startSquare').parent());
});
$(document).on('mouseup mouseleave', "#startSquare", () => squareWave.disconnect());


$(document).on('mousedown', "#startTriangle", () => {
    g.gain.value = 0.68;
    triangleWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startTriangle').parent());
});
$(document).on('mouseup mouseleave', "#startTriangle", () => triangleWave.disconnect());


$(document).on('mousedown', "#startSawtooth", () => {
    g.gain.value = 0.5;
    sawtoothWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startSawtooth').parent());
});
$(document).on('mouseup mouseleave', "#startSawtooth", () => sawtoothWave.disconnect());


/// pulls selected sound wave, augments synth params, continues to amp stage 
$(document).on('click', '#pickOsc>span', ()=>{
    if ($('.oscSelect').attr('wave')===undefined) {
        window.alert('Please Select a Soundwave');
    } else {
        eduParams.oscillator.type = $('.oscSelect').attr('wave');
        console.log(eduParams);
    }
});



/// ADSR Graph

function draw() {
    let canvas = document.getElementById("adsr");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    $("#chartCtrl").on("input", function () {
        let aVal = +($("#attack").val() * 100);
        let dVal = +(canvas.height) - +($("#decay").val() * +(canvas.height)); 
        let sVal = +(canvas.height) - +($("#sustain").val() * +(canvas.height));
        let rVal = +(canvas.width) - (+($("#release").val() * 100));
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (dVal > sVal) dVal = sVal;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(+aVal, +dVal);
        ctx.strokeStyle = 'rgb(255,250,250)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(255,250,250)';
        // ctx.fillRect(+aVal, +dVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+aVal, +dVal);
        ctx.lineTo(100, +sVal);
        ctx.strokeStyle = 'rgb(255,250,250)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(255,250,250)';
        // ctx.fillRect(130, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(100, +sVal);
        ctx.lineTo(+rVal, +sVal);
        ctx.strokeStyle = 'rgb(255,250,250)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(255,250,250)';
        // ctx.fillRect(+rVal, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+rVal, +sVal);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(255,250,250)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(255,250,250)';
        // ctx.fillRect(130, +sVal, 5, 5);
    });
    $("#chartCrtl").trigger("input");
}

draw();







// let sineConnected = false;
// let squareConnected = false;
// let triangleConnected = false;
// let sawtoothConnected = false;

// const playSine = () => {
//     if (!sineConnected) {
//         sineWave.connect(audioCtx.destination);
//     }
//     else {
//         sineWave.disconnect();
//     }
//     sineConnected = !sineConnected;
// };

// const playSquare = () => {
//     if (!squareConnected) {
//         squareWave.connect(audioCtx.destination);
//     }
//     else {
//         squareWave.disconnect();
//     }
//     squareConnected = !squareConnected;
// };

// const playTriangle = () => {
//     if (!triangleConnected) {
//         triangleWave.connect(audioCtx.destination);
//     }
//     else {
//         triangleWave.disconnect();
//     }
//     triangleConnected = !triangleConnected;
// };

// const playSawtooth = () => {
//     if (!sawtoothConnected) {
//         sawtoothWave.connect(audioCtx.destination);
//     }
//     else {
//         sawtoothWave.disconnect();
//     }
//     sawtoothConnected = !sawtoothConnected;
// };