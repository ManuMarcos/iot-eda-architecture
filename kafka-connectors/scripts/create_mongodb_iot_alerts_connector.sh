#!/bin/sh

if [ -z "$MONGO_URI" ]; then
  echo "Error: MONGO_URI no está definida en el entorno"
  exit 1
fi

JSON_BODY=$(cat <<EOF
{
  "name": "mongodb-iot-processed-connector",
  "config": {
    "connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
    "tasks.max": 1,
    "topics": "iot-processed",
    "connection.uri": "$MONGO_URI",
    "database": "ecosensedb",
    "collection": "alerts",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": false
  }
}
EOF
)

# --- Hacer POST al endpoint de Kafka Connect ---
curl -X POST -H "Content-Type: application/json" --data-binary "$JSON_BODY" http://kafka-connect:8083/connectors