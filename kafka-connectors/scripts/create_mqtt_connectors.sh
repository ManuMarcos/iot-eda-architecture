#!/bin/sh
curl -X POST http://kafka-connect:8083/connectors -H "Content-Type: application/json; charset=UTF-8"  --data-binary "@/scripts/config/connect-mqtt-iot-raw.json"