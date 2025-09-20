package com.manumarcos.sensors_service.config;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class MqttConfig {
    @Bean
    public MqttConnectOptions provideMqttConnectOptions(){
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);
        return options;
    }

    @Bean
    public IMqttClient provideMqttClient(@Value("${mqtt.server.url}") String mqttServerUrl,
                                 MqttConnectOptions mqttConnectOptions) throws MqttException {
        String publisherId = UUID.randomUUID().toString();
        IMqttClient client = new MqttClient(mqttServerUrl, publisherId);
        client.connect(mqttConnectOptions);
        return client;
    }

}
