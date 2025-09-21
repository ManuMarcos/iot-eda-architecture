import os

KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TMP_DIR = "./tmp/"
SPARK_JARS_PACKAGES="org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0"