'use strict';
// const $ = require('jquery');

// let sineConnected = false;
// let squareConnected = false;
// let triangleConnected = false;
// let sawtoothConnected = false;
// let stream;

// let waves = ["sine", "triangle", "square", "sawtooth"];
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
// let audioCtx = new window.AudioContext();

// let sineWave = audioCtx.createOscillator();
// let squareWave = audioCtx.createOscillator();
// let triangleWave = audioCtx.createOscillator();
// let sawtoothWave = audioCtx.createOscillator();

// sineWave.type = 'sine';
// squareWave.type = 'square';
// triangleWave.type = 'triangle';
// sawtoothWave.type = 'square';

// sineWave.frequency.setValueAtTime(440, audioCtx.currentTime);
// squareWave.frequency.setValueAtTime(440, audioCtx.currentTime);
// triangleWave.frequency.setValueAtTime(440, audioCtx.currentTime);
// sawtoothWave.frequency.setValueAtTime(440, audioCtx.currentTime);

// sineWave.start(0);
// squareWave.start(0);
// triangleWave.start(0);
// sawtoothWave.start(0);


// const playSine = () => {
//     if (!sineConnected) {
//         stream = sineWave;
//         sineWave.connect(audioCtx.destination);
//         analyseOsc(stream);
//     }
//     else {
//         sineWave.disconnect();
//     }
//     sineConnected = !sineConnected;
// };

// const playSquare = () => {
//     if (!squareConnected) {
//         stream = squareWave;
//         squareWave.connect(audioCtx.destination);
//         analyseOsc(stream);
//     }
//     else {
//         squareWave.disconnect();
//     }
//     squareConnected = !squareConnected;
// };

// const playTriangle = () => {
//     if (!triangleConnected) {
//         stream = triangleWave;
//         triangleWave.connect(audioCtx.destination);
//         analyseOsc(stream);
//     }
//     else {
//         triangleWave.disconnect();
//     }
//     triangleConnected = !triangleConnected;
// };

// const playSawtooth = () => {
//     if (!sawtoothConnected) {
//         stream = sawtoothWave;
//         sawtoothWave.connect(audioCtx.destination);
//         analyseOsc(stream);
//     }
//     else {
//         sawtoothWave.disconnect();
//     }
//     sawtoothConnected = !sawtoothConnected;
// };

// $("#startSine").click(()=> playSine());
// $("#startSquare").click(() => playSquare());
// $("#startTriangle").click(() => playTriangle());
// $("#startSawtooth").click(() => playSawtooth());


// /// visual analyser
// function analyseOsc (stream) {

//     let analyser = audioCtx.createAnalyser();
//     let source = audioCtx.createMediaStreamSource(stream);
//     source.connect(analyser);

//     analyser.fftSize = 2048;
//     let bufferLength = analyser.frequencyBinCount;
//     let dataArray = new Uint8Array(bufferLength);
//     analyser.getByteTimeDomainData(dataArray);

//     let canvas = document.querySelector("#oscScope");
//     let cCtx = canvas.getContext("2d");
//     cCtx.clearRect(0,0,canvas.width,canvas.height);
//     function draw() {
//         let drawVisual = requestAnimationFrame(draw);
//         analyser.getByteTimeDomainData(dataArray);
//         cCtx.fillStyle = 'rgb(34, 34, 34)';
//         cCtx.fillRect(0, 0, canvas.width, canvas.height);
//         cCtx.beginPath();
//         let sliceWidth = canvas.width * 1.0 / bufferLength;
//         let x = 0;
//         for (let i = 0; i < bufferLength; i++) {

//             let v = dataArray[i] / 128.0;
//             let y = v * canvas.height / 2;

//             if (i === 0) {
//                 cCtx.moveTo(x, y);
//             } else {
//                 cCtx.lineTo(x, y);
//             }

//             x += sliceWidth;
//         }
//         cCtx.lineTo(canvas.width, canvas.height / 2);
//         cCtx.stroke();
//     }
//     draw();
// }



// if (navigator.mediaDevices) {
//     navigator.mediaDevices.getUserMedia({ audio: true})
//         .then(function (stream) {

//         });
//     }









