package com.manumarcos.notifications_service.repository;

import com.manumarcos.notifications_service.model.CompanyContacts;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ICompanyContactsRepository extends MongoRepository<CompanyContacts, String> {
    Optional<CompanyContacts> findByCompanyName(String companyId);
}
