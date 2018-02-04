'use strict';
const $ = require('jquery');

module.exports.setPatch = () => {
    return new Promise((resolve, reject) => {
        $.ajax({url: '../patchData.json'})
        .done( patch => {
            resolve(patch);
        });
    });
};

module.exports.savePatch = (patchData) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../patchData.json',
            method: 'POST',
            data: JSON.stringify(patchData)
        })
        .done(patch => {
            console.log(patch);
            resolve(patch);
        });
    });
};