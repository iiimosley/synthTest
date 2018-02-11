'use strict';
const $ = require('jquery');
const osc = require('../templates/osc.hbs');
const oscDetail = require('../templates/osc-detail.hbs');

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

// module.exports.closeBuild = (patchName, bool) => {
//     $(".patchModal").empty();
//     $(".patchModal").append(success({ name: patchName, delete: bool }));
//     setTimeout(() => {
//         $(".patchModal").parent().fadeOut();
//     }, 1000);
// };
