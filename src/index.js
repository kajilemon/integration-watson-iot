'use strict';

const util = require('util');
const ttn = require('ttn');
const EventEmitter = require('events');
const watsoniot = require("ibmiotf");

const DEFAULT_TTN_BROKER = '127.0.0.1';

const Bridge = class Bridge extends EventEmitter {
  constructor(appId, appAccessKey, options) {
    super();
    options = options || {};

    this._qos = options.qos || 0;
    this._createMessage = options.createMessage || function(uplink) {
      const metadata = {
        deviceId: uplink.devEUI,
        time: uplink.metadata.server_time
      };
      return Object.assign({}, uplink.fields, metadata);
    }
    this._createDownScheMessage = options.createDownScheMessage || function(downlink) {
      return Object.assign({}, downlink);
    }
    this._createDownSentMessage = options.createDownSentMessage || function(downlink) {
      return Object.assign({}, downlink);
    }

    this.watsoniotClient = new watsoniot.IotfDevice(options.config);
    this.watsoniotClient.connect();
    this.watsoniotClient.on('connect', super.emit.bind(this, 'watsoniot-connect'));
    this.watsoniotClient.on('error', super.emit.bind(this, 'error'));
    this.watsoniotClient.on('command', super.emit.bind(this, 'watsoniot-command'));

    this.ttnClient = new ttn.Client(options.ttnBroker || DEFAULT_TTN_BROKER, appId, appAccessKey);
    this.ttnClient.on('connect', super.emit.bind(this, 'ttn-connect'));
    this.ttnClient.on('error', super.emit.bind(this, 'error'));
    this.ttnClient.on('activation', this._handleActivation.bind(this));
    this.ttnClient.on('message', this._handleMessage.bind(this));
    this.ttnClient.on('device', null, 'down/scheduled', this._handleDownSche.bind(this));
    this.ttnClient.on('device', null, 'down/sent', this._handleDownSent.bind(this));

    this.on('downlink', this._handleDownlink.bind(this));
  }

  _handleActivation(deviceId, data) {
    const message = JSON.stringify(data);
    super.emit('activation', { deviceId: deviceId, message: message });
  }

  _handleMessage(deviceId, data) {
    const message = JSON.stringify(this._createMessage(data));
    super.emit('message', { deviceId: deviceId, message: message });
    this.watsoniotClient.publish("status","json",message, this._qos);
  }
  _handleDownSche(deviceId, data) {
    const message = JSON.stringify(this._createDownScheMessage(data));
    super.emit('downsche', { deviceId: deviceId, message: message });
  } 
  _handleDownSent(deviceId, data) {
    const message = JSON.stringify(this._createDownSentMessage(data));
    super.emit('downsent', { deviceId: deviceId, message: message });
  } 
  _handleDownlink(deviceId, payload) {
    this.ttnClient.send(deviceId, payload);
  }
}

module.exports = {
  Bridge: Bridge
};
