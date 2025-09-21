package com.manumarcos.notifications_service.service;

import com.manumarcos.notifications_service.dto.AlertDTO;
import com.manumarcos.notifications_service.model.Notification;

import java.util.List;

public interface INotificationService {

    List<Notification> getAll();
    List<Notification> findAllByField(String field);
    void send(AlertDTO alertDTO);
}
