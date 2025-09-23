package com.manumarcos.notifications_service.service.impl;

import com.manumarcos.notifications_service.dto.AlertDTO;
import com.manumarcos.notifications_service.model.Notification;
import com.manumarcos.notifications_service.repository.ICompanyContactsRepository;
import com.manumarcos.notifications_service.repository.INotificationsRepository;
import com.manumarcos.notifications_service.service.IEmailService;
import com.manumarcos.notifications_service.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    private final INotificationsRepository notificationsRepository;
    private final IEmailService emailService;
    private final CompanyContactsService companyContactsService;

    @Override
    public List<Notification> getAll() {
        return notificationsRepository.findAll();
    }

    @Override
    public List<Notification> findAllByField(String field) {
        return notificationsRepository.findAllByField(field);
    }

    @Override
    public void send(AlertDTO alertDTO) {
        String subject = "Alerta del sensor " + alertDTO.getSensor() + " con id: " + alertDTO.getId();
        String text = """
                Se recibio una alerta del sensor %s con id:%s que midio el valor:%f a la fecha y hora %s,
                los umbrales configurados son min: %f  max:%f
                se recomienda %s
                """.formatted(alertDTO.getSensor(), alertDTO.getId(),
                alertDTO.getAlert_value(), alertDTO.getDatetime().toString(),
                alertDTO.getUmbral_min(), alertDTO.getUmbral_max(), alertDTO.getRecommendation());
        List<String> recipients = companyContactsService.getEmailsForField(alertDTO.getCompany(), alertDTO.getField());
        for(String recipient : recipients){
            emailService.sendSimpleMessage(recipient,subject, text);
        }
        notificationsRepository.save(
                Notification.builder()
                        .date(LocalDateTime.now())
                        .company(alertDTO.getCompany())
                        .field(alertDTO.getField())
                        .text(text)
                        .subject(subject)
                        .recipients(recipients)
                        .build());
    }


}
