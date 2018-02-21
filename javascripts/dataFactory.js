'use strict';
const $ = require('jquery');


module.exports.savePatch = (patchData) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://synthulx.firebaseio.com/patches.json',
            method: 'POST',
            data: JSON.stringify(patchData)
        })
            .done(patch => {
                resolve(patch);
            })
            .fail(err => reject(err));
    });
};


module.exports.getPatches = (uid) => {
    return new Promise((resolve, reject) => {
        $.ajax({ url: `https://synthulx.firebaseio.com/patches.json?orderBy="uid"&equalTo="${uid}"` })
            .done(patches => {
                let patchKeys = Object.keys(patches);
                patchKeys.map(key => {
                    patches[key].patch_id = key;
                });
                resolve(patches);
            })
            .fail(err => reject(err));
    });
};


module.exports.loadPatch = (pKey) => {
    return new Promise((resolve, reject) => {
        $.ajax({ url: `https://synthulx.firebaseio.com/patches/${pKey}.json` })
            .done(patch => resolve(patch))
            .fail(err => reject(err));
    });
};


//overwrites specified patch with current synth settings
module.exports.overwritePatch = (patch, params) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://synthulx.firebaseio.com/patches/${patch}.json`,
            method: 'PUT',
            data: JSON.stringify(params)
        })
        .done(patch => {
            resolve(patch);
        })
        .fail(err => reject(err));
    });
};

module.exports.deletePatch = (patch) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://synthulx.firebaseio.com/patches/${patch}.json`,
            method: 'DELETE'
        })
        .done(patch => resolve(patch))
        .fail(err => reject(err));
    });
};



//radio button patches on load (no login)
module.exports.setPatch = () => {
    return new Promise((resolve, reject) => {
        $.ajax({url: '../patchData.json'})
        .done( patch => resolve(patch))
        .fail(err => reject(err));
    });
};