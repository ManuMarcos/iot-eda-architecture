FROM bitnami/spark:latest
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir findspark python-dotenv
CMD ["spark-submit", "--master", "local[*]", "main.py"]