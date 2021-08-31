/* jshint ignore:start */

"use strict";

const mqttConf = require('../mqttConf');


test('check MQTT-settings', () => {

    let conf = mqttConf.getConfBroker();
    console.log(conf);

    expect(conf.host).toBeDefined();
    expect(conf.port).toEqual("8883");
    expect(conf.protocol).toEqual("mqtts");
    expect(conf.rejectUnauthorized).toEqual(false);
    expect(conf.ca).toBeDefined();
    expect(conf.key).toBeDefined();
    expect(conf.cert).toBeDefined();
 });

/* jshint ignore:end */