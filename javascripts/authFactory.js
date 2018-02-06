"use strict";

const $ = require('jquery');
const firebase = require("./config/fb-config");
const auth = require("firebase/auth");
const DataFactory = require('./dataFactory');
const view = require('./view');
const provider = new firebase.auth.GoogleAuthProvider();

module.exports.authUser = () => firebase.auth().signInWithPopup(provider);

module.exports.logout = () => firebase.auth().signOut();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        DataFactory.getPatches(user.uid);
        view.userAuth();
        $('#patchData').show();
        let currentUser = firebase.auth().currentUser;
    } else {
        console.log('not logged in');
        view.noUser();
        $('#patchData').hide();
    }
});