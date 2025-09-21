from pyspark.sql.functions import current_timestamp, when, from_unixtime, window, col, min as spark_min, max as spark_max, avg, date_format, lit
import time
from pyspark.sql.functions import to_json, struct, col, lit

def calculate_trends(df):
    print("entro a trends")

    # ---- Normalización para este caso de uso ----
    df = df.withColumn("year_month_day", date_format(col("event_time"), "yyyy-MM-dd"))

    # ----- Agregaciones por minuto ----
    df_agg = df.groupBy(col("sensor"), col("year_month_day"), window(col("event_time"), "1 minute"), col("field"), col("company"), col("id")).agg(
            spark_min("value").alias("min_value"),
            spark_max("value").alias("max_value"),
            avg("value").alias("avg_value"),
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
        lit("trend").alias("type"),
        current_timestamp().alias("latestUpdate"),
        lit("news").alias("filter"),
        col("min_value").alias("min"),
        col("max_value").alias("max"),
        col("avg_value").alias("avg"),
        col("year_month_day").alias("period"),
        col("window.start").alias("startTime"), 
        col("window.end").alias("endTime")
    )

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
                col("min"),
                col("max"),
                col("avg"),
                col("period"),
                col("type"),
                col("startTime"),
                col("endTime")
            )
        ).alias("value"),
    )

    query = (
        df_kafka.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", "44.223.188.196:29092")
        .option("topic", "iot-processed")
        .option("checkpointLocation", "./tmp/checkpoint_trends")
        .trigger(processingTime='1 minute')
        .outputMode("complete")
        .start()
    )

    # query = df_result.writeStream \
    #     .format("console") \
    #     .outputMode("update") \
    #     .trigger(processingTime='60 seconds') \
    #     .start()               

    return query