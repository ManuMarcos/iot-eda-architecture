package com.manumarcos.sensors_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorDataDTO {

    @JsonProperty("id")
    private String id;

    @JsonProperty("company")
    private String company;

    @JsonProperty("field")
    private String field;

    @JsonProperty("sensor")
    private String sensor;

    @JsonProperty("date")
    private Date date;

    @JsonProperty("timestamp")
    private long timestamp;

    @JsonProperty("payload")
    private Map<String, Object> payload;

}
