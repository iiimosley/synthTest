'use strict';

const AuthFactory = require('./authFactory');
const $ = require('jquery');
const Handlebars = require('hbsfy/runtime');
const inNav = require('../templates/in-nav.hbs');
const outNav = require('../templates/out-nav.hbs');

module.exports.userAuth = () => {
    $("#nav").empty();
    $("#nav").append(inNav);
};

module.exports.noUser = () => {
    $("#nav").empty();
    $("#nav").append(outNav);
};


