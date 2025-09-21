from dotenv import load_dotenv
import os
import findspark
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType, MapType, LongType
from pyspark.sql.functions import col, from_unixtime, timestamp_millis
import time
from pyspark.sql.functions import from_unixtime, col, window, sum
from pyspark.sql.functions import date_format
from processor.totals import calculate_totals
from processor.trends import calculate_trends
from processor.histograms import calculate_histogram
from processor.thresholds import calculate_thresholds
from pyspark.sql.functions import lit, to_json, struct
from pyspark.sql.functions import col, from_json
from processor.normalizer import normalization
from config import KAFKA_BOOTSTRAP_SERVERS, TMP_DIR, SPARK_JARS_PACKAGES
from schemas import schema
import shutil
import os

def create_spark_session():
    spark = SparkSession.builder \
        .appName("SparkEcoSense") \
        .config("spark.jars.packages", SPARK_JARS_PACKAGES) \
        .getOrCreate()
    return spark

def read_kafka(spark, topic_name):
    return spark.readStream.format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS) \
        .option("subscribe", topic_name) \
        .option("startingOffsets", "latest") \
        .load()

# ------ Limpieza de checkpoints porque no incluimos persistencia ------
if os.path.exists(TMP_DIR):
    shutil.rmtree(TMP_DIR)
    print("Carpeta ./tmp/ eliminada.")
os.makedirs(TMP_DIR, exist_ok=True)

spark = create_spark_session()
print("----------Spark conectado----------")

df = read_kafka(spark, "iot-raw")

df = normalization.noramalizer_dataframe(df, schema)

query_totals = calculate_totals(df)
query_trends = calculate_trends(df)
query_histogram = calculate_histogram(df)
query_thresholds = calculate_thresholds(df)

queries = [ query_thresholds, query_totals, query_histogram, query_trends ]

try:
    while any(q.isActive for q in queries):
        time.sleep(1)
except KeyboardInterrupt:
    for q in queries:
        q.stop()
        q.awaitTermination()