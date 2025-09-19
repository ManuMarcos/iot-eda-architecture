package com.manumarcos.iot.sensor;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class EnergySensor extends IotSensor{

    private final Random random = new Random();
    private double accumulatedEnergy = 0.0; //energia acumulada en kWh

    public EnergySensor(String company, String field, String sensorId) {
        super(company, field, sensorId, "energy");
    }

    @Override
    protected Map<String, Object> generatePayload() {
        Map<String, Object> payload = new HashMap<>();

        double voltage = 220 + random.nextGaussian() * 5;       // 220V ±5V
        double current = 5 + random.nextDouble() * 10;          // 5–15A
        double powerFactor = 0.85 + random.nextDouble() * 0.15; // 0.85–1
        double activePower = voltage * current * powerFactor;  // W
        accumulatedEnergy += activePower / 1000 * 0.001;       // kWh aproximado por lectura
        double frequency = 50 + random.nextGaussian() * 0.1;   // Hz

        payload.put("voltage", Math.round(voltage * 10.0) / 10.0);
        payload.put("current", Math.round(current * 10.0) / 10.0);
        payload.put("activePower", Math.round(activePower * 10.0) / 10.0);
        payload.put("energy", Math.round(accumulatedEnergy * 1000.0) / 1000.0);
        payload.put("powerFactor", Math.round(powerFactor * 100.0) / 100.0);
        payload.put("frequency", Math.round(frequency * 10.0) / 10.0);

        return payload;
    }
}
