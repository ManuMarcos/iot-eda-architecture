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
import shutil
import os

load_dotenv()

JAVA_HOME = os.getenv("JAVA_HOME")
SPARK_HOME = os.getenv("SPARK_HOME")
HADOOP_HOME = os.getenv("HADOOP_HOME")

os.environ["JAVA_HOME"] = JAVA_HOME
os.environ["SPARK_HOME"] = SPARK_HOME
os.environ["HADOOP_HOME"] = HADOOP_HOME
os.environ["PATH"] = os.path.join(JAVA_HOME, "bin") + os.pathsep + \
                     os.path.join(SPARK_HOME, "bin") + os.pathsep + \
                     os.path.join(HADOOP_HOME, "bin") + os.pathsep + \
                     os.environ["PATH"]

MONGODB_URI = os.getenv("MONGODB_URI")
NAME_DB = os.getenv("NAME_DB")

def create_spark_session():
    findspark.init(SPARK_HOME)
    spark = SparkSession.builder \
        .appName("SparkEcoSense") \
        .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0") \
        .getOrCreate()
    return spark

from pyspark.sql.types import StructType, StructField, StringType, DoubleType, LongType

schema = StructType([
    StructField("id", StringType(), True),
    StructField("company", StringType(), True),
    StructField("field", StringType(), True),
    StructField("sensor", StringType(), True),
    StructField("timestamp", LongType(), True),
    StructField("payload", StructType([
        StructField("flowRate", DoubleType(), True),
        StructField("ph", DoubleType(), True),
        StructField("energy", DoubleType(), True),
        StructField("current", DoubleType(), True),
        StructField("voltage", DoubleType(), True),
        StructField("activePower", DoubleType(), True),
        StructField("powerFactor", DoubleType(), True),
        StructField("frequency", DoubleType(), True),
        StructField("co2", DoubleType(), True),
        StructField("pm25", DoubleType(), True),
        StructField("pm10", DoubleType(), True)
    ]))
])

def read_kafka(spark, topic_name):
    return spark.readStream.format("kafka") \
        .option("kafka.bootstrap.servers", "44.223.188.196:29092") \
        .option("subscribe", topic_name) \
        .option("startingOffsets", "latest") \
        .load()

# ------ Limpieza de checkpoints porque no incluimos persistencia ------
TMP_DIR = "./tmp/"
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