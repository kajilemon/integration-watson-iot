'use strict';

const ttnwatsoniot = require('../src');

// Replace with your AppEUI and App Access Key
const appEUI = '<insert AppEUI>';
const appAccessKey = '<insert App Access Key>';

// Replace with your Watson IoT config
var config = {
    "org" : "<insert Watson-IoT org value>",
    "type" : "<insert Watson-IoT type value>",
    "id" : "<insert Watson IoT id value>",
    "domain": "internetofthings.ibmcloud.com",
    "auth-method" : "token",
    "auth-token" : "<insert Watson Iot auth token>"
};

var options = {};
options.config = config;
options.qos = 2;

const bridge = new ttnwatsoniot.Bridge(appEUI, appAccessKey, options);

bridge.on('watsoniot-connect', () => {
  console.log('Watson IoT connected');
});

bridge.on('ttn-connect', () => {
  console.log('TTN connected');
});

bridge.on('error', err => {
  console.warn('Error', err);
});

bridge.on('uplink', e => {
  console.log('%s: Uplink', e.devEUI, e.message);
});

