#!/bin/sh

FIELDS="areco junin mercedes"
SENSORS="water energy air"

CONNECT_URL="http://kafka-connect:8083/connectors"

for field in $FIELDS; do
  for sensor in $SENSORS; do
    MQTT_TOPIC="la_rinconada/${field}/${sensor}"
    KAFKA_TOPIC="la_rinconada-${field}-${sensor}"
    CONNECTOR_NAME="mqtt-la_rinconada-${field}-${sensor}-connector"

    echo "Creating connector: $CONNECTOR_NAME"

    curl -s -X POST $CONNECT_URL \
      -H "Content-Type: application/json" \
      -d "{
            \"name\": \"${CONNECTOR_NAME}\",
            \"config\": {
              \"connector.class\": \"io.confluent.connect.mqtt.MqttSourceConnector\",
              \"tasks.max\": \"1\",
              \"mqtt.server.uri\": \"tcp://mosquitto:1883\",
              \"mqtt.topics\": \"${MQTT_TOPIC}\",
              \"kafka.topic\": \"${KAFKA_TOPIC}\",
              \"value.converter\": \"org.apache.kafka.connect.converters.ByteArrayConverter\",
              \"converter.encoding\": \"UTF-8\",
              \"bootstrap.servers\": \"kafka:9092\",
              \"confluent.topic.bootstrap.servers\": \"kafka:9092\",
              \"confluent.topic.replication.factor\": 1
            }
          }"

    echo -e "\n"
  done
done