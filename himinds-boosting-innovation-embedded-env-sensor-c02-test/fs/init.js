/*
 * Copyright (c) HiMinds.com
 *
 * Author:  Suru Dissanaike
 *
 * All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the ""License"");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an ""AS IS"" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

load('api_config.js');
load('api_sys.js');
load('api_timer.js');

let value = 0;

let WINSEN = {
   get_co2_value: ffi('int get_co2_value(void)')
};

function myCallback() {
   let value = WINSEN.get_co2_value();
   print("CO2", value);

}

Timer.set(60000, Timer.REPEAT, myCallback, null);