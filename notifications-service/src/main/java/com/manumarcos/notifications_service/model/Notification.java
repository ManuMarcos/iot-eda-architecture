package com.manumarcos.notifications_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Document("notifications")
@Data
@Builder
public class Notification {
    @Id
    private String id;

    private String subject;

    private String text;

    private String company;

    private String field;

    private LocalDateTime date;

    private List<String> recipients;
}
