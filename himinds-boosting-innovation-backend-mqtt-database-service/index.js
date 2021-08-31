/*
 * Copyright (c) HiMinds.com
 *
 * Author:  Suru Dissanaike <suru.dissanaike@himinds.com>
 *
 * MIT License
 *
 * Copyright (c) 2020
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";

require('dotenv').config();

const mqtt = require('mqtt');
var mqttConf = require('./mqttConf');
const DB = require('./database');

console.log("BROKER_TOPIC_MEASUREMENT: " + process.env.BROKER_TOPIC_MEASUREMENT);
console.log("BROKER_TOPIC_SYSTEM: " + process.env.BROKER_TOPIC_SYSTEM);
console.log("BROKER_TOPIC_BATTERY: " + process.env.BROKER_TOPIC_BATTERY);

// Database init
(async () => {
  let result = await DB.dbSchema();
  if (result === null)
    process.exit();
  else {
    console.log("Database Schema ready");
  }

  result = await DB.dbInit();
  if (result === null)
    process.exit();
  else {
    console.log("Database init done");
  }

})();

//MQTT init
const mqttConfigurationBroker = mqttConf.getConfBroker();
const client = mqtt.connect(mqttConfigurationBroker);
client.subscribe(mqttConf.MQTT_TOPIC);

client.on('connect', () => {
  //
  console.log("Connected to MQTT broker: " + mqttConf.toString());
  console.log(mqttConf);
});


client.on("message", function (topic, message) {

  let messageObject = null;

  try {
    messageObject = JSON.parse(message.toString());

  } catch (error) {
    console.error(error);
    return;
  }

  //console.log(messageObject);

  if (topic === process.env.BROKER_TOPIC_MEASUREMENT) {
    (async () => {
      await DB.registerMeasurement(messageObject);
    })();
  } else if (topic === process.env.BROKER_TOPIC_SYSTEM) {
    (async () => {
      await DB.registerSystem(messageObject);
    })();
  } else if (topic === process.env.BROKER_TOPIC_BATTERY) {
    (async () => {
      await DB.registerBattery(messageObject);
    })();
  }
});