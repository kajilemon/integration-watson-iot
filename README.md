# The Things Network Example Integration with IBM Watson IoT Platform

This is an example integration of The Things Network with IBM Watson IoT Platform

[Learn more about Watson Iot Platform](https://www.ibm.com/internet-of-things/platform/iot-developer/)

## Setup

Make sure you have to regist your The Things Network Application as Watson IoT device.
1. login to Bluemix Console
2. check your organization for your account which is refered as "org".
3. login to Watson IoT dashboard
4. Create device type (eg. ttn) which is refered as "type".
5. Create device (eg. loraapp) which is refered as "id".
6. Create Application API key which is refered as "auth-token".

You need this parameters (org, type, id, auth-token) to connect to Watson Iot Platform.

## Example
```simple.js
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
```
