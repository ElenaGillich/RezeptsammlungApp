package org.example.backend.model;

import lombok.*;

import java.util.List;

@With
@Builder
@Data
public class Recipe {
    String id;
    String name;
    String category;
    String image;
    List<Ingredient> ingredients;
    String description;
    PreparationSpeed speed;
    String notes;
    String opinionOfTheDish;
    String linkToSource;
    Boolean favorite;
}
