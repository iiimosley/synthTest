'use strict';
const $ = require('jquery');
const eduCtrl = require('./edu-control');
const osc = require('../templates/osc.hbs');
const oscDetail = require('../templates/osc-detail.hbs');
const ampEG = require('../templates/amp-eg.hbs');
const ampEGDetail = require('../templates/amp-eg-detail.hbs');
const cutoffFilter = require('../templates/filter.hbs');

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

module.exports.printFilterDetail = () => {
    $("#eduWrap").empty();
    $("#eduWrap").append(cutoffFilter);
    eduCtrl.cutoffDraw();
};

// module.exports.closeBuild = (patchName, bool) => {
//     $(".patchModal").empty();
//     $(".patchModal").append(success({ name: patchName, delete: bool }));
//     setTimeout(() => {
//         $(".patchModal").parent().fadeOut();
//     }, 1000);
// };
