package com.manumarcos.notifications_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class AlertDTO {

    private String sensor;

    private String id;

    private Double alert_value;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date datetime;

    private String type;

    private String field;

    private String company;

    private String recommendation;

    private Double umbral_max;

    private Double umbral_min;
}
