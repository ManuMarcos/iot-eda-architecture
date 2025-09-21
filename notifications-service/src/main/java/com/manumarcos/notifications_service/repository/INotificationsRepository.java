package com.manumarcos.notifications_service.repository;


import com.manumarcos.notifications_service.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public class NotificationsRepository extends MongoRepository<Notification, > {
}
