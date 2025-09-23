package com.manumarcos.notifications_service.service.impl;

import com.manumarcos.notifications_service.model.CompanyContacts;
import com.manumarcos.notifications_service.repository.ICompanyContactsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CompanyContactsService {

    private final ICompanyContactsRepository companyContactsRepository;

    public List<String> getEmailsForField(String companyName, String fieldId) {
        return companyContactsRepository.findByCompanyName(companyName)
                .flatMap(company -> company.getFields().stream()
                        .filter(f -> f.getFieldId().equals(fieldId))
                        .findFirst()
                )
                .map(field -> field.getContacts().stream()
                        .map(CompanyContacts.Contact::getEmail)
                        .toList()
                )
                .orElse(List.of());
    }
}
