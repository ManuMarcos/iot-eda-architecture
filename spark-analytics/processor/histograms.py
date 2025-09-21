from pyspark.sql import SparkSession
from pyspark.sql.functions import count, col, from_unixtime, year, avg, lit, date_format, when, current_timestamp
from pyspark.sql.functions import to_json, struct, col, lit
import time
from datetime import datetime
from config import KAFKA_BOOTSTRAP_SERVERS

def calculate_histogram(df):
    print("entro a histogram")

    # ---- Normalización para este caso de uso ----
    df = df.withColumn("year", date_format(col("event_time"), "yyyy"))

    # ----- Agregaciones por sensor, sede y año ----
    df_agg = df.groupBy("id", "company", "field", "year", "sensor").agg(
        avg("value").alias("average")
    )

    # ---- Transformación a formato JSON ----
    df_result = df_agg.select(
        col("sensor"),
        col("id"),
        col("company"),
        when(col("sensor") == "water", lit("ml"))
        .when(col("sensor") == "energy", lit("kWh"))
        .when(col("sensor") == "air", lit("hdc"))
        .otherwise(lit("unknown"))
        .alias("unit"),
        lit("filter").alias("sede"),
        col("field"),
        current_timestamp().alias("latestUpdate"),
        lit("histogramavg").alias("type"),
        col("average").alias("avg")
    )

    # ---- Serialización JSON para Kafka ----
    df_kafka = df_result.select(
        to_json(
            struct(
                col("sensor"),
                col("id"),
                col("company"),
                col("unit"),
                col("sede"),
                col("field"),
                col("latestUpdate"),
                col("type"),
                col("avg")
            )
        ).alias("value"),
    )

    # query = df_result.writeStream \
    #     .format("console") \
    #     .outputMode("complete") \
    #     .option("checkpointLocation", "./tmp/checkpoint_histogramavg") \
    #     .trigger(processingTime='60 seconds') \
    #     .start()                          

    query = (
        df_kafka.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
        .option("topic", "iot-processed")
        .option("checkpointLocation", "./tmp/checkpoint_histograms")
        .trigger(processingTime='1 minute')
        .outputMode("complete")
        .start()
    )

    return query
