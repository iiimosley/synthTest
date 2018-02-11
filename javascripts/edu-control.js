'use strict';

const $ = require('jquery');
const Tone = require('tone');
const eduView = require('./edu-view');

$(document).on('click', '#startBuild', ()=> eduView.startBuild());


/// oscillator

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new window.AudioContext();

let sineWave = audioCtx.createOscillator();
let squareWave = audioCtx.createOscillator();
let triangleWave = audioCtx.createOscillator();
let sawtoothWave = audioCtx.createOscillator();

sineWave.type = 'sine';
squareWave.type = 'square';
triangleWave.type = 'triangle';
sawtoothWave.type = 'sawtooth';

let waves = [sineWave, squareWave, triangleWave, sawtoothWave];

waves.forEach(wave=>{
    console.log(wave);
});


sineWave.frequency.setValueAtTime(440, audioCtx.currentTime);
squareWave.frequency.setValueAtTime(440, audioCtx.currentTime);
triangleWave.frequency.setValueAtTime(440, audioCtx.currentTime);
sawtoothWave.frequency.setValueAtTime(440, audioCtx.currentTime);

sineWave.start(0);
squareWave.start(0);
triangleWave.start(0);
sawtoothWave.start(0);

function selectOsc(wave) {
    wave.addClass('oscSelect');
    $('aside>div').not(wave).removeClass('oscSelect');
}


$(document).on('mousedown', '#startSine', function() {
    console.log($(this));
    sineWave.connect(audioCtx.destination);
    selectOsc($('#startSine').parent());
});
$(document).on('mouseup mouseleave', "#startSine", () => sineWave.disconnect());


$(document).on('mousedown', "#startSquare", () => {
    squareWave.connect(audioCtx.destination);
    selectOsc($('#startSquare').parent());
});
$(document).on('mouseup mouseleave', "#startSquare", () => squareWave.disconnect());


$(document).on('mousedown', "#startTriangle", () => {
    triangleWave.connect(audioCtx.destination);
    selectOsc($('#startTriangle').parent());
});
$(document).on('mouseup mouseleave', "#startTriangle", () => triangleWave.disconnect());


$(document).on('mousedown', "#startSawtooth", () => {
    sawtoothWave.connect(audioCtx.destination);
    selectOsc($('#startSawtooth').parent());
});
$(document).on('mouseup mouseleave', "#startSawtooth", () => sawtoothWave.disconnect());

$(document).on('click', '#pickOsc>span', ()=>{
    console.log($('.oscSelect'));
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