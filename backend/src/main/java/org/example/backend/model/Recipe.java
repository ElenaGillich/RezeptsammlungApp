package org.example.backend.model;

public record Recipe(
        String id,
        String name,
        DishCategory category,
        String image,
        Ingredient[] ingredients,
        String description,
        PreparationSpeed speed,
        String notes,
        String opinionOfTheDish,
        String linkToSource,
        boolean isFavorite
) { }
