'use strict';

const $ = require('jquery');
const Tone = require('tone');
const eduView = require('./edu-view');
const main = require('./main');

$(document).on('click', '#startBuild', ()=> eduView.startBuild());


/// synth for builder + params

let buildPatch = {};


let eduParams = {
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
        baseFrequency: 15000,
        octaves: 3,
        exponent: 2
    }
};

let eduSynth = new Tone.MonoSynth(eduParams);
eduSynth.toMaster();
console.log(eduSynth);

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
    g.gain.value = 0.71;
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
//////////////////


/// pulls selected sound wave, augments synth params, continues to amp stage 
$(document).on('click', '#pickOsc', ()=>{
    if ($('.oscSelect').attr('wave')===undefined) {
        window.alert('Please Select a Soundwave');
    } else {
        eduSynth.oscillator.type = $('.oscSelect').attr('wave');
        buildPatch.osc = $('.oscSelect').attr('wave');
        console.log(buildPatch);
        eduView.printAmpEG();
    }
});


/// listener for range input on AmpEG
$(document).on('input', '#eduAmpEG', function() {
    eduSynth.envelope.attack = $('#aAttack').val();
    eduSynth.envelope.decay = $('#aDecay').val();
    eduSynth.envelope.sustain = $('#aSustain').val();
    eduSynth.envelope.release = $('#aRelease').val();
});

$(document).on('mousedown', '#eduAmpEG', ()=>eduView.printAmpEGDetail(event.target.id));


/// AMP ADSR Graph

module.exports.ampDraw = () => {
    let canvas = document.getElementById("ampADSR");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    $(document).on("input", "#eduAmpEG", function () {
        let aVal = +($("#aAttack").val() * 90);
        let dVal = +(canvas.height) - +($("#aDecay").val() * +(canvas.height)); 
        let sVal = +(canvas.height) - +($("#aSustain").val() * +(canvas.height));
        let rVal = +(canvas.width) - (+($("#aRelease").val() * 100));
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (dVal > sVal) dVal = sVal;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(+aVal, +dVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(+aVal, +dVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+aVal, +dVal);
        ctx.lineTo(100, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(130, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(100, +sVal);
        ctx.lineTo(+rVal, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(+rVal, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+rVal, +sVal);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(130, +sVal, 5, 5);
    });
    $("#eduAmpEG").trigger("input");
};

$(document).on('click', '#pickAmp', ()=>{
    buildPatch.ampAttack = $('#aAttack').val();
    buildPatch.ampDecay = $('#aDecay').val();
    buildPatch.ampSustain = $('#aSustain').val();
    buildPatch.ampRelease = $('#aRelease').val();
    console.log(buildPatch);
    eduView.printFilter();
});
/////////////////////////


/// cutoff filter
////range input listeners
$(document).on('input', '#eduFilter', function () {
    eduSynth.filterEnvelope.baseFrequency = $("#fCutoff").val();
    eduSynth.filter.Q.value = $('#fResonance').val();
});

$(document).on('mousedown', '#eduFilter', () => eduView.printFilterDetail(event.target.id));


module.exports.cutoffDraw = () => {
    let canvas = document.getElementById("cutoffView");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    $(document).on("input", "#eduFilter", function () {
        let fVal = +($("#fCutoff").val() / 40)+35;
        let qVal = +($("#fResonance").val());
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(+fVal, canvas.height);
        ctx.bezierCurveTo((+fVal - 30), 10, (+fVal - 31), 76 / +qVal, (+fVal - 70), 60);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(+aVal, +dVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo((+fVal - 70), 60);
        ctx.lineTo(0, 60);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(130, +sVal, 5, 5);

    });
    $("#eduFilter").trigger("input");
};

$(document).on('click', '#pickCutoff', () => {
    buildPatch.filterFreq = $("#fCutoff").val();
    buildPatch.filterQ = $('#fResonance').val();
    console.log(buildPatch);
    eduView.printFilterEG();
});
////////////////////




/// listener for range input on FilterEG
$(document).on('input', '#eduFilterEG', function () {
    eduSynth.filterEnvelope.attack = $('#fAttack').val();
    eduSynth.filterEnvelope.decay = $('#fDecay').val();
    eduSynth.filterEnvelope.sustain = $('#fSustain').val();
    eduSynth.filterEnvelope.release = $('#fRelease').val();
});

$(document).on('mousedown', '#eduFilterEG', () => eduView.printFilterEGDetail(event.target.id));


/// Filter ADSR Graph

module.exports.filterDraw = () => {
    let canvas = document.getElementById("filterADSR");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    $(document).on("input", "#eduFilterEG", function () {
        let aVal = +($("#fAttack").val() * 90);
        let dVal = +(canvas.height) - +($("#fDecay").val() * +(canvas.height));
        let sVal = +(canvas.height) - +($("#fSustain").val() * +(canvas.height));
        let rVal = +(canvas.width) - (+($("#fRelease").val() * 100));
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (dVal > sVal) dVal = sVal;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(+aVal, +dVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(+aVal, +dVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+aVal, +dVal);
        ctx.lineTo(100, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(130, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(100, +sVal);
        ctx.lineTo(+rVal, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(+rVal, +sVal, 5, 5);

        ctx.beginPath();
        ctx.moveTo(+rVal, +sVal);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
        // ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.fillRect(130, +sVal, 5, 5);
    });
    $("#eduFilterEG").trigger("input");
};

$(document).on('click', '#pickFilter', () => {
    buildPatch.filterAttack = $('#fAttack').val();
    buildPatch.filterDecay = $('#fDecay').val();
    buildPatch.filterSustain = $('#fSustain').val();
    buildPatch.filterRelease = $('#fRelease').val();
    console.log(buildPatch);
    main.receivePatch(buildPatch);
    eduView.leaveBuilder();
});






// spacebar plays single oscillator of synth builder when modal is in view
$(document).on('keydown', ()=>{
    if (event.keyCode === 32 && $('#eduModal').css('display') == 'block' && !event.repeat) {
        event.preventDefault();
        eduSynth.triggerAttack('A4');
    } else if (event.keyCode === 32 && $('#eduModal').css('display') == 'block' && event.repeat) {
        event.preventDefault();
    }
});

$(document).on('keyup', (e) => {
    if (e.keyCode === 32 && $('#eduModal').css('display') == 'block') {
        eduSynth.triggerRelease();
    }
});

