'use strict';
const $ = require('jquery');
const eduCtrl = require('./edu-control');
const osc = require('../templates/osc.hbs');
const oscDetail = require('../templates/osc-detail.hbs');
const ampEG = require('../templates/amp-eg.hbs');
const ampEGDetail = require('../templates/amp-eg-detail.hbs');
const cutoffFilter = require('../templates/filter.hbs');
const filterDetail = require('../templates/filter-detail.hbs');
const filterEG = require('../templates/filter-eg.hbs');
const filterEGDetail = require('../templates/filter-eg-detail.hbs');
const buildComplete = require('../templates/complete.hbs');

module.exports.startBuild = () => {
    $("#eduModal").empty();
    $("#eduModal").append(osc);
    $("#eduModal").show();
};

module.exports.printOscDetail = (wave) => {
    let oscObj = {};
    oscObj[wave] = true;
    $("#oscDetail").empty();
    $("#oscDetail").append(oscDetail(oscObj));
};

//if no oscillator selected: flashes screen to user prompt selection
module.exports.oscAlert = () => {
    $("#oscAlert").fadeIn(500);
    setTimeout(() => {
        $("#oscAlert").fadeOut(1000);
    }, 1000);
};

module.exports.printAmpEG = () => {
    $("#eduWrap").empty();
    $("#eduWrap").append(ampEG);
    eduCtrl.ampDraw();
};

module.exports.printAmpEGDetail = (EG) => {
    let ampObj = {};
    ampObj[EG] = true;
    $("#ampDetail").empty();
    $("#ampDetail").append(ampEGDetail(ampObj));
};

module.exports.printFilter = () => {
    $("#eduWrap").empty();
    $("#eduWrap").append(cutoffFilter);
    eduCtrl.cutoffDraw();
};

module.exports.printFilterDetail = (f) => {
    let fObj = {};
    fObj[f] = true;
    $("#cutoffDetail").empty();
    $("#cutoffDetail").append(filterDetail(fObj));
};

module.exports.printFilterEG = () => {
    $("#eduWrap").empty();
    $("#eduWrap").append(filterEG);
    eduCtrl.filterDraw();
};

module.exports.printFilterEGDetail = (f) => {
    let fObj = {};
    fObj[f] = true;
    $("#filterDetail").empty();
    $("#filterDetail").append(filterEGDetail(fObj));
};

module.exports.leaveBuilder = () => {
    $("#eduModal").empty();
    $("#eduModal").hide();
    $("#completeModal").show();
    $("#completeModal").append(buildComplete);
    setTimeout(() => {
        $("#completeModal").fadeOut(300);
        $("#completeModal").empty();
    }, 1500);
};