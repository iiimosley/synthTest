'use strict';

const AuthFactory = require('./authFactory');
const $ = require('jquery');
const Handlebars = require('hbsfy/runtime');
const inNav = require('../templates/in-nav.hbs');
const outNav = require('../templates/out-nav.hbs');
const userBtns = require('../templates/user-buttons.hbs');

module.exports.userAuth = (patches) => {
    console.log("patches to nav", patches);
    $("#nav").empty();
    $("#nav").append(inNav);
    $("#userTools").append(userBtns);
};

module.exports.noUser = () => {
    $("#nav").empty();
    $("#nav").append(outNav);
    $("#userTools").empty();
};


