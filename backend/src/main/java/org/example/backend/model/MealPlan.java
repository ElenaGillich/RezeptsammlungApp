package org.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.With;

import java.util.List;

@Data
@With
@AllArgsConstructor
public class MealPlan {
    String id;
    String name;
    List<Recipe> recipes;
}
