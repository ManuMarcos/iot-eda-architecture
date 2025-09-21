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