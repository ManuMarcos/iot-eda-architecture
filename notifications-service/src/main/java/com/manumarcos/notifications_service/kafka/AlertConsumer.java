package com.manumarcos.notifications_service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.manumarcos.notifications_service.dto.AlertDTO;
import com.manumarcos.notifications_service.service.IEmailService;
import com.manumarcos.notifications_service.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertConsumer {

    private final ObjectMapper objectMapper;
    private final INotificationService notificationService;

    @KafkaListener(topics = "iot-alerts", groupId = "alert-mailer-service")
    public void consume(String message){
        try {
            AlertDTO alert = objectMapper.readValue(message, AlertDTO.class);
            notificationService.send(alert);
        } catch (JsonProcessingException e) {
            System.out.println("Ocurrio un error al leer el mensaje");
        }
    }
}
