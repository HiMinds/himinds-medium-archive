# Stores mqtt data in Influx db


## database schema

A measurement that changes over time should be a field, and metadata about the measurement should be in tags.

Tags and fields are effectively columns in the table. tags are indexed, fields are not
the values that are highly variant and not usually part of a WHERE clause are put into fields
Store data in fields if you plan to use them with an InfluxQL function

Tags containing highly variable information like UUIDs, hashes, and random strings will lead to a large number of series in the database, 
known colloquially as high series cardinality. High series cardinality is a primary driver of high memory usage for many database workloads.

[source](https://dba.stackexchange.com/questions/163292/understanding-how-to-choose-between-fields-and-tags-in-influxdb)


## influx CLI

```
InfluxDB shell version: v1.7.7
> use env
Using database env
> DROP DATABASE env
> CREATE DATABASE env
> 
```

```
SHOW FIELD KEYS
 ```
```
SHOW TAG KEYS
```


```
use env

SELECT "humidity","pressure","temperature" FROM "env_measurement" WHERE time > now() -1m and device_id='esp32_04D0D0'

```
