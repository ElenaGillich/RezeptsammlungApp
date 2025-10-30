package org.example.backend.dto;

import lombok.With;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;

import java.util.List;

@With
public record RecipeDto(
        String name,
        DishCategory category,
        String image,
        List<Ingredient> ingredients,
        String description,
        PreparationSpeed speed,
        String notes,
        String opinionOfTheDish,
        String linkToSource,
        boolean favorite
) {}
