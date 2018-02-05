"use strict";

const $ = require('jquery');
const firebase = require("./config/fb-config");
const auth = require("firebase/auth");
const provider = new firebase.auth.GoogleAuthProvider();

module.exports.authUser = () => firebase.auth().signInWithPopup(provider);

module.exports.logout = () => firebase.auth().signOut();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        $('#login').hide();
        $('#logout').show();
        $('#patchData').show();
        let currentUser = firebase.auth().currentUser;
    } else {
        console.log('not logged in');
        $('#login').show();
        $('#logout').hide();
        $('#patchData').hide();
    }
});