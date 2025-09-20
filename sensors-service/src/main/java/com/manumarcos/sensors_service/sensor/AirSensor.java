package com.manumarcos.sensors_service.sensor;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;


public class AirSensor extends IotSensor{

    private final Random random = new Random();

    public AirSensor(String company, String field, String sensorId) {
        super(company, field, sensorId, "air");
    }

    @Override
    protected Map<String, Object> generatePayload() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("pm25", simulatePm25());
        payload.put("co2", simulateCo2());
        payload.put("pm10", simulatePm10());
        return payload;
    }

    private Double simulateCo2(){
        return  350 + random.nextDouble() * 250; // 350 a 550 ppm
    }

    private Double simulatePm25(){
        double basePM25 = 15 + 5 * Math.sin(System.currentTimeMillis() / 3600_000.0);
        return basePM25 + random.nextGaussian() * 2; // 5 a 35 µg/m³
    }

    private Double simulatePm10(){
        return 15 + random.nextDouble() * 40; //15 a 55 µg/m³
    }
}
