package org.example.backend.repository;

import org.example.backend.model.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MealPlanRepository extends MongoRepository<MealPlan, String> { }
