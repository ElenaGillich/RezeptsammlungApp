package org.example.backend.model;

import lombok.Builder;
import lombok.With;

import java.util.List;

@With
@Builder
public record Recipe(
        String id,
        String name,
        DishCategory category,
        String image,
        List<Ingredient> ingredients,
        String description,
        PreparationSpeed speed,
        String notes,
        String opinionOfTheDish,
        String linkToSource,
        boolean isFavorite
) { }
