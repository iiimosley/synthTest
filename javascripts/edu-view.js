'use strict';
const $ = require('jquery');
const osc = require('../templates/osc.hbs');

module.exports.startBuild = () => {
    $("#eduModal").empty();
    $("#eduModal").append(osc);
    $("#eduModal").show();
};

// module.exports.closeBuild = (patchName, bool) => {
//     $(".patchModal").empty();
//     $(".patchModal").append(success({ name: patchName, delete: bool }));
//     setTimeout(() => {
//         $(".patchModal").parent().fadeOut();
//     }, 1000);
// };
