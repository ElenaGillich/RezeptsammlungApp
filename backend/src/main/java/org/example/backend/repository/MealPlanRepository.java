package org.example.backend.repository;

import org.example.backend.model.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MealPlanRepository extends MongoRepository<MealPlan, String> {
    List<MealPlan> getById(String id);
}
