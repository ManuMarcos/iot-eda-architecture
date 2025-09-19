package com.manumarcos.iot;


import com.manumarcos.iot.model.SensorDataDTO;
import com.manumarcos.iot.sensor.AirSensor;
import com.manumarcos.iot.sensor.EnergySensor;
import com.manumarcos.iot.sensor.IotSensor;
import com.manumarcos.iot.sensor.WaterSensor;
import com.manumarcos.iot.service.SensorPublisher;
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
                new WaterSensor("la_rinconada", "mercedes", "w001"),
                new WaterSensor("la_rinconada", "mercedes", "w002"),
                new WaterSensor("la_rinconada", "junin", "w003"),
                new WaterSensor("la_rinconada", "junin", "w004"),
                new WaterSensor("la_rinconada", "junin", "w004"),

                //Air Sensors
                new AirSensor("la_rinconada", "mercedes", "a001"),
                new AirSensor("la_rinconada", "mercedes", "a002"),
                new AirSensor("la_rinconada", "junin", "a003"),
                new AirSensor("la_rinconada", "junin", "a004"),
                new AirSensor("la_rinconada", "junin", "a005"),

                //Energy Sensors
                new EnergySensor("la_rinconada", "mercedes", "e001"),
                new EnergySensor("la_rinconada", "mercedes", "e002"),
                new EnergySensor("la_rinconada", "junin", "e003"),
                new EnergySensor("la_rinconada", "mercedes", "e004"),
                new EnergySensor("la_rinconada", "junin", "e005")
                );

        while (true) {
            for (IotSensor sensor : sensors) {
                CompletableFuture.supplyAsync(() -> {
                            try {
                                // Ejecuta el sensor y genera datos
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
                // Espera 2 segundos entre iteraciones
                Thread.sleep(2);
            } catch (InterruptedException e) {
                log.warn("Sensor simulator interrupted", e);
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
