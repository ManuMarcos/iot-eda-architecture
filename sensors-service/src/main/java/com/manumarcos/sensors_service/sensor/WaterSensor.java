package com.manumarcos.sensors_service.sensor;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;


public class WaterSensor extends IotSensor{

    private final Random random = new Random();

    public WaterSensor(String company, String field, String sensorId) {
        super(company, field, sensorId, "water");
    }


    @Override
    protected Map<String, Object> generatePayload() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("flowRate", 5 + random.nextDouble() * 10);
        payload.put("ph", simulatePh());
        return payload;
    }

    private Double simulatePh(){
        double meanPH = 6.8;
        double stdDev = 0.3;
        double pH = meanPH + random.nextGaussian() * stdDev;
        return Math.max(0, Math.min(14, pH));
    }
}
