'use strict';

const $ = require('jquery');
const Tone = require('tone');
const eduView = require('./edu-view');
const main = require('./main');

// resets params for synth in synthbuilder on load
$(document).on('click', '#startBuild', ()=> {
    resetSynth();
    eduView.startBuild();
});

// object that holds values of parameters set through synthbuilder
let buildPatch = {};

//init variable for synth in synthbuilder (reset purposed)
let eduSynth;

//init params for synth in synthbuilder (reset purposed)
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

//resets params of synth everytime synthbuilder is loaded
function resetSynth () {
    eduSynth = new Tone.MonoSynth(eduParams);
    eduSynth.toMaster();
}


// Web Audio Oscillators: context and gain
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new window.AudioContext();
let g = audioCtx.createGain();

//creates separate osc for each wave
let sineWave = audioCtx.createOscillator();
let squareWave = audioCtx.createOscillator();
let triangleWave = audioCtx.createOscillator();
let sawtoothWave = audioCtx.createOscillator();

// set osc type for each individual osc
sineWave.type = 'sine';
squareWave.type = 'square';
triangleWave.type = 'triangle';
sawtoothWave.type = 'sawtooth';

let waves = [sineWave, squareWave, triangleWave, sawtoothWave];

// set osc frequency
sineWave.frequency.setValueAtTime(440, audioCtx.currentTime);
squareWave.frequency.setValueAtTime(440, audioCtx.currentTime);
triangleWave.frequency.setValueAtTime(440, audioCtx.currentTime);
sawtoothWave.frequency.setValueAtTime(440, audioCtx.currentTime);

// init osc
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
//plays sine wave on click, end oscillation on mouseup or mouse leave
$(document).on('mousedown', '#startSine', function() {
    sineWave.connect(audioCtx.destination);
    selectOsc($('#startSine').parent());
});
$(document).on('mouseup mouseleave', "#startSine", () => sineWave.disconnect());

// || square wave
$(document).on('mousedown', "#startSquare", () => {
    g.gain.value = 0.3;
    squareWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startSquare').parent());
});
$(document).on('mouseup mouseleave', "#startSquare", () => squareWave.disconnect());

// || triangle wave
$(document).on('mousedown', "#startTriangle", () => {
    g.gain.value = 0.71;
    triangleWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startTriangle').parent());
});
$(document).on('mouseup mouseleave', "#startTriangle", () => triangleWave.disconnect());

// || sawtooth wave
$(document).on('mousedown', "#startSawtooth", () => {
    g.gain.value = 0.5;
    sawtoothWave.connect(g);
    g.connect(audioCtx.destination);
    selectOsc($('#startSawtooth').parent());
});
$(document).on('mouseup mouseleave', "#startSawtooth", () => sawtoothWave.disconnect());


// Oscillator Animation toggle
$(document).on('mousedown', '#oscView>aside>div>button', function(){
    $(this).next().addClass("oscAnimate");
});

$(document).on('mouseup mouseleave', '#oscView>aside>div>button', function () {
    $(this).next().removeClass("oscAnimate");
});


/// augments synth osc params, adds selected wave to buildPatch, continues to amp stage
$(document).on('click', '#pickOsc', ()=>{
    if ($('.oscSelect').attr('wave')===undefined) {
        // screen prompt when no osc selected
        eduView.oscAlert();
    } else {
        eduSynth.oscillator.type = $('.oscSelect').attr('wave');
        buildPatch.osc = $('.oscSelect').attr('wave');
        eduView.printAmpEG();
    }
});


// AMP EG
/// listener for range input on AmpEG, augments synth params for amp eg
$(document).on('input', '#eduAmpEG', function() {
    eduSynth.envelope.attack = $('#aAttack').val();
    eduSynth.envelope.decay = $('#aDecay').val();
    eduSynth.envelope.sustain = $('#aSustain').val();
    eduSynth.envelope.release = $('#aRelease').val();
});

//toggles amp details when targeted range input is clicked
$(document).on('mousedown', '#eduAmpEG', (e)=>eduView.printAmpEGDetail(e.target.id));


/// AMP ADSR Graph

module.exports.ampDraw = () => {
    let canvas = document.getElementById("ampADSR");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    // plot points change with range input
    // redraws with every change
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

        ctx.beginPath();
        ctx.moveTo(+aVal, +dVal);
        ctx.lineTo(100, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, +sVal);
        ctx.lineTo(+rVal, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(+rVal, +sVal);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

    });
    $("#eduAmpEG").trigger("input");
};

// sets value to buildPatch
$(document).on('click', '#pickAmp', ()=>{
    buildPatch.ampAttack = $('#aAttack').val();
    buildPatch.ampDecay = $('#aDecay').val();
    buildPatch.ampSustain = $('#aSustain').val();
    buildPatch.ampRelease = $('#aRelease').val();
    eduView.printFilter();
});
/////////////////////////



/// Filter Cutoff
////range input listeners, augments synth filter cutoff settings
$(document).on('input', '#eduFilter', function () {
    eduSynth.filterEnvelope.baseFrequency = $("#fCutoff").val();
    eduSynth.filter.Q.value = $('#fResonance').val();
});

// toggles filter details when targeted range input is clicked
$(document).on('mousedown', '#eduFilter', (e) => eduView.printFilterDetail(e.target.id));


// Filter Cutoff Graph

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

        ctx.beginPath();
        ctx.moveTo((+fVal - 70), 60);
        ctx.lineTo(0, 60);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

    });
    $("#eduFilter").trigger("input");
};

// sets values of cutoff filter to buildPatch
// continues to next section
$(document).on('click', '#pickCutoff', () => {
    buildPatch.filterFreq = $("#fCutoff").val();
    buildPatch.filterQ = $('#fResonance').val();
    eduView.printFilterEG();
});
////////////////////


//Filter EG
/// listener for range input on FilterEG, augments synth filter eg params
$(document).on('input', '#eduFilterEG', function () {
    eduSynth.filterEnvelope.attack = $('#fAttack').val();
    eduSynth.filterEnvelope.decay = $('#fDecay').val();
    eduSynth.filterEnvelope.sustain = $('#fSustain').val();
    eduSynth.filterEnvelope.release = $('#fRelease').val();
});

// toggles filter details when targeted range input is clicked
$(document).on('mousedown', '#eduFilterEG', (e) => eduView.printFilterEGDetail(e.target.id));


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

        ctx.beginPath();
        ctx.moveTo(+aVal, +dVal);
        ctx.lineTo(100, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, +sVal);
        ctx.lineTo(+rVal, +sVal);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(+rVal, +sVal);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();

    });
    $("#eduFilterEG").trigger("input");
};

// sets filter eg params to buildPatch
// calls for buildPatch to be applied to synth 
// leaves synthbuilder
$(document).on('click', '#pickFilter', () => {
    buildPatch.filterAttack = $('#fAttack').val();
    buildPatch.filterDecay = $('#fDecay').val();
    buildPatch.filterSustain = $('#fSustain').val();
    buildPatch.filterRelease = $('#fRelease').val();
    main.receivePatch(buildPatch);
    eduView.leaveBuilder();
});




// spacebar plays single oscillator of synth builder when modal is in view
// prevents page movement while testing oscillator
$(document).on('keydown', (e)=>{
    if (e.key === " " && $('#eduModal').css('display') == 'block' && !e.originalEvent.repeat) {
        e.preventDefault();
        $('.spacebarEvent').addClass('pressingSpace');
        eduSynth.triggerAttack('A4');
    } else if (e.key === " " && $('#eduModal').css('display') == 'block' && e.originalEvent.repeat) {
        e.preventDefault();
    }
});

$(document).on('keyup', (e) => {
    if (e.key === " " && $('#eduModal').css('display') == 'block') {
        eduSynth.triggerRelease();
        $('.spacebarEvent').removeClass('pressingSpace');
    }
});

