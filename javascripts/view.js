'use strict';

const AuthFactory = require('./authFactory');
const $ = require('jquery');
const Handlebars = require('hbsfy/runtime');

const eduCtrl = require('./edu-control');

const inNav = require('../templates/in-nav.hbs');
const outNav = require('../templates/out-nav.hbs');
const userBtns = require('../templates/user-buttons.hbs');
const registerModal = require('../templates/register.hbs');
const editModal = require('../templates/edit-modal.hbs');
const saveModal = require('../templates/save-modal.hbs');
const deleteModal = require('../templates/delete-modal.hbs');
const success = require('../templates/success.hbs');

module.exports.userAuth = (patches) => {
    $("#nav").empty();
    $("#nav").append(inNav({userPatches: patches}));
};

module.exports.userFeat = () => {
    $("#userTools").append(userBtns);
};

module.exports.noUser = () => {
    $("#nav").empty();
    $("#nav").append(outNav);
    $("#registerModal").empty();
    $("#registerModal").append(registerModal);
    $("#registerModal").show();
    $("#userTools").empty();
};

module.exports.editView = (patches) => {
    $("#editModal").empty();
    $("#editModal").append(editModal({userPatches: patches}));
    $("#editModal").show();
};

module.exports.saveView = () => {
    $("#saveModal").empty();
    $("#saveModal").append(saveModal);
    $("#saveModal").fadeIn(100, ()=>$(this).show());
};

module.exports.deleteView = (id, patch) => {
    $("#deleteModal").empty();
    $("#deleteModal").append(deleteModal({patchID: id, patchName: patch}));
    $("#deleteModal").show();
};

module.exports.leaveModal = (patchName, bool) => {
    $(".patchModal").empty();
    $(".patchModal").append(success({name: patchName, delete: bool}));
    setTimeout(() => {
        $(".patchModal").parent().fadeOut();
    }, 1000);
};
