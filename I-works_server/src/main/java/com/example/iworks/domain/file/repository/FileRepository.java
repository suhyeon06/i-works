package com.example.iworks.domain.file.repository;

import com.example.iworks.domain.file.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Integer> {
}
