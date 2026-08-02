const admin = require('firebase-admin');
admin.initializeApp();

const { submitFlag } = require('./src/submitFlag');

exports.submitFlag = submitFlag;
