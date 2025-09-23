package com.manumarcos.notifications_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "company_contacts")
public class CompanyContacts {
    @Id
    private String id;
    private String companyId;
    private String companyName;
    private List<FieldContact> fields;

    private String updatedAt;


    @Data
    public static class FieldContact {
        private String fieldId;
        private String fieldName;
        private List<Contact> contacts;
    }

    @Data
    public static class Contact {
        private String email;

    }
}
