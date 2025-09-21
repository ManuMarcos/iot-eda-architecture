package com.manumarcos.notifications_service.service;

public interface IEmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
