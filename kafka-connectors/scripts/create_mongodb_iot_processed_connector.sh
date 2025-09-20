#!/bin/sh

ENV_FILE="../.env"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Verifica que la variable esté definida
if [ -z "$MONGO_URI" ]; then
  echo "Error: MONGO_URI no está definida en .env"
  exit 1
fi

# --- Construir el JSON dinámicamente ---
JSON_BODY=$(cat <<EOF
{
  "name": "mongodb-iot-processed-connector",
  "config": {
    "connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
    "tasks.max": 1,
    "topics": "iot-processed",
    "connection.uri": "$MONGO_URI",
    "database": "ecosensedb",
    "collection": "processed",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": false
  }
}
EOF
)

# --- Hacer POST al endpoint de Kafka Connect ---
curl -X POST \
     -H "Content-Type: application/json" \
     --data "$JSON_BODY" \
     http://kafka-connect:8083/connectors