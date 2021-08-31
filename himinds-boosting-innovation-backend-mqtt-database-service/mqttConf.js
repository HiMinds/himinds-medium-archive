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

const fs = require('fs');
require('dotenv').config();

var CLIENT_KEY = fs.readFileSync(process.env.BROKER_CLIENT_KEY);
var CLIENT_CERT = fs.readFileSync(process.env.BROKER_CLIENT_CRT);
var CA_CERT = [fs.readFileSync(process.env.BROKER_CA_CRT)];

module.exports.MQTT_TOPIC = "#";


var options = {
  host: process.env.BROKER_HOST,
  port: process.env.BROKER_PORT,
  rejectUnauthorized: false,
  protocol: 'mqtts',
  ca: CA_CERT,
  key: CLIENT_KEY,
  cert: CLIENT_CERT
};

module.exports.getConfBroker = function (){
   return options;
};