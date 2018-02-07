'use strict';

const AuthFactory = require('./authFactory');
const $ = require('jquery');
const Handlebars = require('hbsfy/runtime');
const inNav = require('../templates/in-nav.hbs');
const outNav = require('../templates/out-nav.hbs');
const userBtns = require('../templates/user-buttons.hbs');
const editModal = require('../templates/edit-modal.hbs');
const saveModal = require('../templates/save-modal.hbs');
const deleteModal = require('../templates/delete-modal.hbs');
const success = require('../templates/success.hbs');

module.exports.userAuth = (patches) => {
    $("#nav").empty();
    $("#nav").append(inNav({userPatches: patches}));
    $("#userTools").append(userBtns);
};

module.exports.noUser = () => {
    $("#nav").empty();
    $("#nav").append(outNav);
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
    $("#saveModal").show();
};

module.exports.deleteView = (id, patch) => {
    $("#deleteModal").empty();
    $("#deleteModal").append(deleteModal({patchID: id, patchName: patch}));
    $("#deleteModal").show();
};

module.exports.leaveModal = (patchName, bool) => {
    $(".patchModal").empty();
    console.log(patchName);
    $(".patchModal").append(success({name: patchName, delete: bool}));
    setTimeout(() => {
        $(".patchModal").parent().hide();
    }, 2000);
};
