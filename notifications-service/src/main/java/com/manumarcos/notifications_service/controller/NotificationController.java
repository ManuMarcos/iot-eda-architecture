package com.manumarcos.notifications_service.controller;

import com.manumarcos.notifications_service.model.Notification;
import com.manumarcos.notifications_service.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final INotificationService notificationService;

    @GetMapping
    public List<Notification> getAll(){
        return notificationService.getAll();
    }

    @GetMapping(params = "field")
    public ResponseEntity<List<Notification>> getAllByField(@RequestParam String field){
        return ResponseEntity.ok(notificationService.findAllByField(field));
    }

}
