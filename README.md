# IoT & Notification Platform

## Overview

This project is a **full-stack IoT and Notification Platform** designed for real-time analytics, alerting, and email notifications. It integrates multiple technologies to collect, process, and visualize data from IoT sensors and other sources.

## Architecture
![Architecture Diagram](/architecture-diagram.png)

**Key components:**

- **Kafka**: messaging system for alerts and sensor data.  
- **Notification Service**: consumes Kafka messages, stores data in MongoDB, sends emails.  
- **MongoDB**: central document-based storage.  
- **Apache Spark Streaming**: processes Kafka streams, generates real-time metrics and alerts.  
- **MQTT**: sensor integration (air, water, electricity) via TCP/WebSocket.  
- **MailHog**: SMTP testing server.  
- **Docker Compose**: orchestrates services locally or in cloud (EC2).  

---

**Flow description:**

1. IoT sensors (air, water, electricity) send data via MQTT.  
2. Kafka topics capture alerts and sensor updates.  
3. Spark Streaming consumes Kafka data to compute metrics, trigger alerts, and generate dashboards.  
4. Notification Service receives alert messages, stores them in MongoDB, and sends email notifications.  
5. MailHog captures test emails locally (SMTP testing).  

---
## Features

- Real-time data collection from IoT sensors.  
- Kafka-based messaging for decoupled microservices.  
- Spark Streaming analytics for metrics and thresholds.  
- MongoDB storage of notifications, sensor readings, and analytics results.  
- Automatic email alerts via JavaMailSender.  
- MailHog for safe email testing.  
- Dockerized setup for local or cloud deployment.  
- MQTT support for WebSocket and TCP.  

---
