from pyspark.sql.functions import col, when, lit, from_unixtime, date_format
from pyspark.sql.functions import to_json, struct, col, lit
import time
from pyspark.sql.functions import col, when, lit, from_unixtime, date_format
from pyspark.sql.functions import to_json, struct, col, lit
import time
from config import KAFKA_BOOTSTRAP_SERVERS

def calculate_thresholds(df):
    print("entro a thresholds")

    # ---- Normalización para este caso de uso ----
    df = df.withColumn("type", lit("alert"))
    df = df.withColumn("datetime", date_format(col("event_time"), "yyyy-MM-dd HH:mm:ss"))

    # ---- Recomendaciones según el sensor y sus umbrales ----
    df = df.withColumn(
        "recommendation",
        when((col("sensor") == "water") & (col("flowRate") > 14.8), lit("Reducir riego o revisar fugas"))
        .when((col("sensor") == "water") & (col("flowRate") < 0.01), lit("Verificar suministro de agua"))
        .when((col("sensor") == "water") & (col("flowRate") == 0), lit("Revisar sensor de agua"))
        .when((col("sensor") == "energy") & (col("current") > 14.8), lit("Apagar equipos innecesarios"))
        .when((col("sensor") == "energy") & (col("current") < 1.1), lit("Revisar si hay falla en medidor o desconexión"))
        .when((col("sensor") == "energy") & (col("current") == 0), lit("Revisar sensor de energía"))
        .when((col("sensor") == "air") & (col("co2") > 598), lit("Ventilar para mejorar calidad del aire"))
        .when((col("sensor") == "air") & (col("co2") < 351), lit("Verificar medición, CO2 demasiado bajo"))
        .when((col("sensor") == "air") & (col("co2") == 0), lit("Revisar sensor de aire"))
        .otherwise(lit(None))
    ).filter(col("recommendation").isNotNull())

    df = df.withColumn(
        "alert_value",
        when((col("sensor") == "water") & (col("flowRate") > 14.5), col("flowRate"))
        .when((col("sensor") == "water") & (col("flowRate") < 0.01), col("flowRate"))
        .when((col("sensor") == "water") & (col("flowRate") == 0), col("flowRate"))
        .when((col("sensor") == "energy") & (col("current") > 3), col("current"))
        .when((col("sensor") == "energy") & (col("current") < 1.1), col("current"))
        .when((col("sensor") == "energy") & (col("current") == 0), col("current"))
        .when((col("sensor") == "air") & (col("co2") > 598), col("co2"))
        .when((col("sensor") == "air") & (col("co2") < 351), col("co2"))
        .when((col("sensor") == "air") & (col("co2") == 0), col("co2"))
    )

    # ---- Selección de columnas para alertas ----
    df_alerts = df.select(
        col("sensor"),
        col("id"),
        col("field"),
        col("company"),
        when(col("sensor") == "water", lit(0.01))
        .when(col("sensor") == "energy", lit(1.1))
        .when(col("sensor") == "air", lit(351))
        .otherwise(lit("unknown"))
        .alias("umbral_min"),
        when(col("sensor") == "water", lit(14.8))
        .when(col("sensor") == "energy", lit(14.8))
        .when(col("sensor") == "air", lit(598))
        .otherwise(lit("unknown"))
        .alias("umbral_max"),
        col("alert_value"),
        col("event_time"),
        col("type"),
        col("recommendation").alias("recommendation"),
        col("datetime"),
        )

    # ---- Serialización JSON para Kafka ----
    df_kafka = df_alerts.select(
        to_json(
            struct(
                col("sensor"),
                col("id"),
                col("field"),
                col("company"),
                col("umbral_min"),
                col("umbral_max"),
                col("alert_value"),
                col("event_time"),
                col("type"),
                col("recommendation"),
                col("datetime")
            )
        ).alias("value"),
    )

    # query = df_alerts.writeStream \
    #     .format("console") \
    #     .outputMode("append") \
    #     .start()

    query = (
        df_kafka.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
        .option("topic", "iot-alerts")
        .option("checkpointLocation", "./tmp/checkpoint_alerts")
        .trigger(processingTime='1 minute')
        .start()
    )


    return query_SERVERS

def calculate_thresholds(df):
    print("entro a thresholds")

    # ---- Normalización para este caso de uso ----
    df = df.withColumn("type", lit("alert"))
    df = df.withColumn("datetime", date_format(col("event_time"), "yyyy-MM-dd HH:mm:ss"))

    # ---- Recomendaciones según el sensor y sus umbrales ----
    df = df.withColumn(
        "recommendation",
        when((col("sensor") == "water") & (col("flowRate") > 14.8), lit("Reducir riego o revisar fugas"))
        .when((col("sensor") == "water") & (col("flowRate") < 0.01), lit("Verificar suministro de agua"))
        .when((col("sensor") == "water") & (col("flowRate") == 0), lit("Revisar sensor de agua"))
        .when((col("sensor") == "energy") & (col("current") > 14.8), lit("Apagar equipos innecesarios"))
        .when((col("sensor") == "energy") & (col("current") < 1.1), lit("Revisar si hay falla en medidor o desconexión"))
        .when((col("sensor") == "energy") & (col("current") == 0), lit("Revisar sensor de energía"))
        .when((col("sensor") == "air") & (col("co2") > 598), lit("Ventilar para mejorar calidad del aire"))
        .when((col("sensor") == "air") & (col("co2") < 351), lit("Verificar medición, CO2 demasiado bajo"))
        .when((col("sensor") == "air") & (col("co2") == 0), lit("Revisar sensor de aire"))
        .otherwise(lit(None))
    ).filter(col("recommendation").isNotNull())

    df = df.withColumn(
    "alert_value",
        when((col("sensor") == "water") & (col("flowRate") > 14.5), col("flowRate"))
        .when((col("sensor") == "water") & (col("flowRate") < 0.01), col("flowRate"))
        .when((col("sensor") == "water") & (col("flowRate") == 0), col("flowRate"))
        .when((col("sensor") == "energy") & (col("current") > 3), col("current"))
        .when((col("sensor") == "energy") & (col("current") < 1.1), col("current"))
        .when((col("sensor") == "energy") & (col("current") == 0), col("current"))
        .when((col("sensor") == "air") & (col("co2") > 598), col("co2"))
        .when((col("sensor") == "air") & (col("co2") < 351), col("co2"))
        .when((col("sensor") == "air") & (col("co2") == 0), col("co2"))
    )
        
    # ---- Selección de columnas para alertas ----
    df_alerts = df.select(
        col("sensor"),
        col("id"),
        col("field"),
        col("company"),
        when(col("sensor") == "water", lit("0.01"))
        .when(col("sensor") == "energy", lit("1.1"))
        .when(col("sensor") == "air", lit("351"))
        .otherwise(lit("unknown"))
        .alias("umbral_min"),
        when(col("sensor") == "water", lit("14.8"))
        .when(col("sensor") == "energy", lit("14.8"))
        .when(col("sensor") == "air", lit("598"))
        .otherwise(lit("unknown"))
        .alias("umbral_max"),
        col("alert_value"),
        col("event_time"),
        col("type"),
        col("recommendation").alias("recommendation"),
        col("datetime"),
    )

    # ---- Serialización JSON para Kafka ----
    df_kafka = df_alerts.select(
        to_json(
            struct(
                col("sensor"),
                col("id"),
                col("field"),
                col("company"),
                col("umbral_min"),
                col("umbral_max"),
                col("alert_value"),
                col("event_time"),
                col("type"),
                col("recommendation"),
                col("datetime")
            )
        ).alias("value"),
    )

    # query = df_alerts.writeStream \
    #     .format("console") \
    #     .outputMode("append") \
    #     .start()   

    query = (
        df_kafka.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
        .option("topic", "iot-alerts")
        .option("checkpointLocation", "./tmp/checkpoint_alerts")
        .trigger(processingTime='1 minute')
        .start()
    )


    return query