package com.manumarcos.notifications_service.service;

import com.manumarcos.notifications_service.repository.INotificationsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final INotificationsRepository notificationsRepository;
}
