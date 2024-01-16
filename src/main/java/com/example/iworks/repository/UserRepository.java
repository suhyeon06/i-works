package com.example.iworks.repository;

import com.example.iworks.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {

    public User findByUsername(String username);
}
