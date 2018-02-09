'use strict';

const $ = require('jquery');
const Tone = require('tone');

function draw() {
    $("#chartCrtl").trigger("change");
    let canvas = document.getElementById("adsr");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    $("#chartCtrl").on("input", function () {
        let aVal = +($("#attack").val() * 100);
        let dVal = +(canvas.height) - +($("#decay").val() * +(canvas.height)); 
        let sVal = +(canvas.height) - +($("#sustain").val() * +(canvas.height));
        let rVal = +(canvas.width) - (+($("#release").val() * 100));
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (dVal > sVal) {
            dVal = sVal;
        }

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
}

draw();