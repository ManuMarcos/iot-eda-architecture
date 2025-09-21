package com.manumarcos.notifications_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class AlertDTO {

    private String sensor;

    private String id;

    private Double alert_value;

    private Date event_time;

    private String type;

    private String field;

    private String company;

    private String recommendation;

    private Double umbral_max;

    private Double umbral_min;
}
