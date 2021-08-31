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

'use strict';
const Influx = require('influx');
require('dotenv').config();
let influx = null;
let influxDBConf = {database: process.env.INFLUX_DATABASE,
precision: 's'}

module.exports.dbSchema = async function () {
/* jshint ignore:start */
   try {
      influx = await new Influx.InfluxDB({
         host: process.env.INFLUX_HOST,
         database: process.env.INFLUX_DATABASE,
         schema: [{
            measurement: 'env_measurement',
            fields: {
               pressure: Influx.FieldType.FLOAT,
               humidity: Influx.FieldType.FLOAT,
               temperature: Influx.FieldType.FLOAT
            },
            tags: ['device_id']
         }, ],

         schema: [{
            measurement: 'env_system',
            fields: {
               core_temperature: Influx.FieldType.FLOAT,
               firmware: Influx.FieldType.STRING,
               model: Influx.FieldType.STRING,
               uptime: Influx.FieldType.FLOAT,
               free_ram: Influx.FieldType.INTEGER,
               total_ram: Influx.FieldType.INTEGER
            },
            tags: ['device_id']
         }, ],
         schema: [{
            measurement: 'env_battery',
            fields: {
               remaining_capacity: Influx.FieldType.FLOAT,
               full_available_capacity: Influx.FieldType.FLOAT,
               battery_level: Influx.FieldType.INTEGER,
               temperature: Influx.FieldType.FLOAT,
               voltage: Influx.FieldType.FLOAT
            },
            tags: ['device_id']
         }, ]
      });
      return true;

   } catch (e) {
      console.log(e);
      return null;
   }
/* jshint ignore:end */
};


module.exports.dbInit = async function () {

   let names = null;

   if (influx === null)
      return null;

   try {
      names = await influx.getDatabaseNames();
   } catch (e) {
      console.log(e);
      return null;
   }
   try {
      if (!names.includes(process.env.INFLUX_DATABASE)) {
         await influx.createDatabase(process.env.INFLUX_DATABASE);
      } else {
         console.log(process.env.INFLUX_DATABASE + " database is already created");
      }

      return true;
      
   } catch (error) {
      console.log(error);
      console.log("Could not connect to InfluxDB");
      return null;
   }
};

module.exports.registerMeasurement = async (measurementObject) => {

   console.log("registerMeasurement");
   const now = new Date();
   let timestamp = Math.round(now.getTime() / 1000);
   console.log(timestamp);
   console.log(measurementObject);

   await influx.writePoints([{
         measurement: 'env_measurement',
         tags: {
            'device_id': measurementObject.device_id
         },
         fields: {
            pressure: measurementObject.data.pressure,
            humidity: measurementObject.data.humidity,
            temperature: measurementObject.data.temperature
         },
         timestamp: timestamp
      }], influxDBConf)
      .catch(err => {
         console.error(`Error saving data to InfluxDB! ${err.stack}`);
      });
};

module.exports.registerSystem = async (systemObject) => {

   console.log("registerSystem");
   const now = new Date();
   let timestamp = Math.round(now.getTime() / 1000);
   console.log(timestamp);
   console.log(systemObject);

   await influx.writePoints([{
         measurement: 'env_system',
         tags: {
            'device_id': systemObject.device_id
         },
         fields: {
            core_temperature: systemObject.data.core_temperature,
            firmware: systemObject.data.firmware,
            model: systemObject.data.model,
            uptime: systemObject.data.uptime,
            free_ram: systemObject.data.free_ram,
            total_ram: systemObject.data.total_ram,
         },
         timestamp: timestamp

      }], {
         influxDBConf
      })
      .catch(err => {
         console.error(`Error saving data to InfluxDB! ${err.stack}`);
      });
};

module.exports.registerBattery = async (batteryObject) => {

   console.log("registerBattery");
   const now = new Date();
   let timestamp = Math.round(now.getTime() / 1000);
   console.log(timestamp);
   console.log(batteryObject);

   await influx.writePoints([{
         measurement: 'env_battery',
         tags: {
            'device_id': batteryObject.device_id
         },
         fields: {
            remaining_capacity: batteryObject.data.remaining_capacity,
            full_available_capacity: batteryObject.data.full_available_capacity,
            battery_level: batteryObject.data.battery_level,
            temperature: batteryObject.data.temperature,
            voltage: batteryObject.data.voltage,
         },
         timestamp: timestamp

      }], {
         database: process.env.INFLUX_DATABASE,
         precision: 's',
      })
      .catch(err => {
         console.error(`Error saving data to InfluxDB! ${err.stack}`);
      });
};