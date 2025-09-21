from pyspark.sql.functions import from_json, when, from_unixtime, window, col, min as spark_min, max as spark_max, avg, date_format, lit
import time

def noramalizer_dataframe(df, schema):
    print("entro al normalizador")
    # ---- Normalización de columnas ----
    df = df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)", "timestamp")

    df = df.withColumn("data", from_json(col("value"), schema)).select("data.*")

    df = df.select("id", "field", "company", "sensor", "payload.*", "timestamp")

    df = df.withColumn(
        "value",
        when(col("sensor") == "water", col("flowRate"))
        .when(col("sensor") == "energy", col("energy"))
        .when(col("sensor") == "air", col("co2"))
        .otherwise(0.0)  # si ninguna condición se cumple
    )
    df = df.withColumn("event_time", from_unixtime(col("timestamp")  / 1000).cast("timestamp"))
    df = df.withColumn("year_month", date_format(col("event_time"), "yyyy-MM"))

    return df