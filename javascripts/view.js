'use strict';

const AuthFactory = require('./authFactory');
const $ = require('jquery');
const Handlebars = require('hbsfy/runtime');
const inNav = require('../templates/in-nav.hbs');
const outNav = require('../templates/out-nav.hbs');
const userBtns = require('../templates/user-buttons.hbs');
const editModal = require('../templates/edit-modal.hbs');
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

module.exports.leaveEdit = (patchName) => {
    $("#editModal>div").empty();
    console.log(patchName);
    $("#editModal>div").append(success({name: patchName}));
    setTimeout(() => {
        $("#editModal").hide();
    }, 2000);
};
