"use strict";

const $ = require('jquery');
const firebase = require("./config/fb-config");
const auth = require("firebase/auth");
const DataFactory = require('./dataFactory');
const main = require('./main.js');
const view = require('./view');
const provider = new firebase.auth.GoogleAuthProvider();

module.exports.authUser = () => firebase.auth().signInWithPopup(provider);

module.exports.logout = () => firebase.auth().signOut();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        main.checkUser(user.uid);
        DataFactory.getPatches(user.uid)
        .then(userPatches =>{
            view.userAuth(userPatches);
            view.userFeat();
        });
    } else {
        console.log('not logged in');
        view.noUser();
        $('#patchData').hide();
    }
});

