package com.manumarcos.notifications_service.repository;


import com.manumarcos.notifications_service.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificationsRepository extends MongoRepository<Notification, String> {

    List<Notification> findAllByField(String field);
}
