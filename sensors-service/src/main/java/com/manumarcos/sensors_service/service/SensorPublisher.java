package com.manumarcos.sensors_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.manumarcos.sensors_service.model.SensorDataDTO;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class SensorPublisher {

    private final IMqttClient mqttClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private final Logger logger = LogManager.getLogger(SensorPublisher.class);

    @Async
    public void publish(String topic, SensorDataDTO data){
        try{
            String json = mapper.writeValueAsString(data);
            MqttMessage mqttMessage = new MqttMessage(json.getBytes(StandardCharsets.UTF_8));
            mqttClient.publish(topic, mqttMessage);
            logger.info("Topic: {} -> {}", topic, mqttMessage);
        } catch (Exception e) {
            logger.error(e);
        }
    }

}
