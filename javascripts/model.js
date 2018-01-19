'use strict';
const $ = require('jquery');

module.exports.setPatch = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../patchData.json'
        }).done( patch => {
            resolve(patch);
        });
    });
};