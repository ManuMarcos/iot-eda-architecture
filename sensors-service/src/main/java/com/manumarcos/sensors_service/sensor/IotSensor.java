package com.manumarcos.sensors_service.sensor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.manumarcos.sensors_service.model.SensorDataDTO;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.Callable;

@Data
public abstract class IotSensor implements Callable<SensorDataDTO> {

    private static final Logger logger = LoggerFactory.getLogger(IotSensor.class);

    protected String company;
    protected String field;
    protected String sensorId;
    protected String sensorType;

    public IotSensor(String company, String field, String sensorId, String sensorType) {
        this.company = company;
        this.field = field;
        this.sensorId = sensorId;
        this.sensorType = sensorType;
    }

    @Override
    public SensorDataDTO call() {
        Map<String, Object> payload = generatePayload();
        long timestamp = System.currentTimeMillis();

        return SensorDataDTO.builder()
                .id(sensorId)
                .company(company)
                .field(field)
                .sensor(sensorType)
                .date(Date.from(Instant.now()))
                .timestamp(timestamp)
                .payload(payload)
                .build();
    }

    protected abstract Map<String, Object> generatePayload();

    public String getMqttTopic(){
        return String.format("%s/%s/%s", company, field, sensorType);
    }

}
