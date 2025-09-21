package com.manumarcos.sensors_service;

import com.manumarcos.sensors_service.model.SensorDataDTO;
import com.manumarcos.sensors_service.sensor.AirSensor;
import com.manumarcos.sensors_service.sensor.EnergySensor;
import com.manumarcos.sensors_service.sensor.IotSensor;
import com.manumarcos.sensors_service.sensor.WaterSensor;
import com.manumarcos.sensors_service.service.SensorPublisher;
import lombok.RequiredArgsConstructor;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RequiredArgsConstructor
@Component
public class SensorSimulator implements CommandLineRunner {

    private final ExecutorService executorService =  Executors.newFixedThreadPool(3);
    private final SensorPublisher publisher;
    private static final Logger log = LogManager.getLogger(SensorSimulator.class);


    @Override
    public void run(String... args) throws Exception {
        List<IotSensor> sensors = Arrays.asList(
                //Water sensors
                new WaterSensor("la_rinconada", "mercedes", "w-me-01"),
                new WaterSensor("la_rinconada", "mercedes", "w-me-02"),
                new WaterSensor("la_rinconada", "junin", "w-ju-01"),
                new WaterSensor("la_rinconada", "junin", "w-ju-02"),
                new WaterSensor("la_rinconada", "junin", "w-ju-03"),
                new WaterSensor("la_rinconada", "areco", "w-ar-01"),
                new WaterSensor("la_rinconada", "areco", "w-ar-02"),

                //Air Sensors
                new AirSensor("la_rinconada", "mercedes", "a-me-01"),
                new AirSensor("la_rinconada", "mercedes", "a-me-02"),
                new AirSensor("la_rinconada", "junin", "a-ju-01"),
                new AirSensor("la_rinconada", "junin", "a-ju-02"),
                new AirSensor("la_rinconada", "junin", "a-ju-03"),
                new AirSensor("la_rinconada", "areco", "a-ar-01"),
                new AirSensor("la_rinconada", "areco", "a-ar-02"),

                //Energy Sensors
                new EnergySensor("la_rinconada", "mercedes", "e-me-01"),
                new EnergySensor("la_rinconada", "mercedes", "e-me-02"),
                new EnergySensor("la_rinconada", "junin", "e-ju-01"),
                new EnergySensor("la_rinconada", "junin", "e-ju-02"),
                new EnergySensor("la_rinconada", "junin", "e-ju-03"),
                new EnergySensor("la_rinconada", "areco", "e-ar-01"),
                new EnergySensor("la_rinconada", "areco", "e-ar-02")
                );



        while (true) {
            for (IotSensor sensor : sensors) {
                CompletableFuture.supplyAsync(() -> {
                            try {
                                SensorDataDTO data = sensor.call();
                                log.debug("Sensor {} generated data: {}", sensor.getSensorId(), data);
                                return data;
                            } catch (Exception e) {
                                log.error("Error executing sensor {}", sensor.getSensorId(), e);
                                return null;
                            }
                        }, executorService)
                        .thenAcceptAsync(data -> {
                            if (data != null) {
                                // Publica el dato en MQTT
                                publisher.publish(sensor.getMqttTopic(), data);
                                log.debug("Published data for sensor {} to topic {}", sensor.getSensorId(), sensor.getMqttTopic());
                            }
                        }, executorService);
            }

            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                log.warn("Sensor simulator interrupted", e);
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
