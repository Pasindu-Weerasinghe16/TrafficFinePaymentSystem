package com.slpolice.monolith.repository;

import com.slpolice.monolith.entity.FineCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineCategoryRepository extends JpaRepository<FineCategory, Long> {
}
