package com.manumarcos.notifications_service.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AlertConsumer {

    @KafkaListener(topics = "iot-alerts", groupId = "alert-mailer-service")
    public void consume(String message){
        System.out.println("Nueva alerta: " + message);
    }
}
