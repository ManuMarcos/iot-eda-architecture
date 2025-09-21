""" Procesamiento de totales con PySpark Structured Streaming (acumulación con checkpoints
 pensado para persistencia pero no entra en la demo) """

from pyspark.sql.functions import sum, from_unixtime, col, date_format, lit, current_timestamp, to_json, struct, concat, when, coalesce
import time
from config import KAFKA_BOOTSTRAP_SERVERS

def calculate_totals(df):
    print("entro a totales")

    # ---- Agregaciones ----
    df_agg = df.groupBy("sensor", "year_month", "id", "field", "company").agg(
        coalesce(sum("value")).alias("total_value")
    )

    # ---- Transformación a formato JSON ----
    df_result = df_agg.select(
        col("sensor"),
        col("id"),
        col("field"),
        col("company"),
        when(col("sensor") == "water", lit("ml"))
        .when(col("sensor") == "energy", lit("kWh"))
        .when(col("sensor") == "air", lit("hdc"))
        .otherwise(lit("unknown"))
        .alias("unit"),
        current_timestamp().alias("latestUpdate"),
        lit("accumulator").alias("filter"),
        col("year_month").alias("period"),
        lit("totals").alias("type"),
        col("total_value").alias("total")
    )


    # ---- Serialización JSON para Kafka ----
    df_kafka = df_result.select(
        to_json(
            struct(
                col("sensor"),
                col("id"),
                col("field"),
                col("company"),
                col("unit"),
                col("latestUpdate"),
                col("filter"),
                col("period"),
                col("type"),
                col("total")
            )
        ).alias("value")
    )

    # query = df_result.writeStream \
    #     .format("console") \
    #     .outputMode("complete") \
    #     .option("checkpointLocation", "./tmp/checkpoint_totalsmonthly") \
    #     .trigger(processingTime='60 seconds') \
    #     .start()  

    query = (
        df_kafka.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
        .option("topic", "iot-processed")
        .option("checkpointLocation", "./tmp/checkpoint_totals")
        .trigger(processingTime='1 minute')
        .outputMode("complete")
        .start()
    )                        

    return query