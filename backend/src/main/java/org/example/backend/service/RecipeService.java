package org.example.backend.service;

import org.example.backend.RecipeRepository;
import org.example.backend.dto.RecipeDto;
import org.example.backend.model.Recipe;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Recipe updateRecipeById(String id, RecipeDto dto) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Recipe with ID=" + id + " not found"));

        Recipe updated = existing
                .withCategory(dto.category())
                .withName(dto.name())
                .withIngredients(dto.ingredients())
                .withImage(dto.image())
                .withSpeed(dto.speed())
                .withDescription(dto.description())
                .withNotes(dto.notes())
                .withOpinionOfTheDish(dto.opinionOfTheDish())
                .withLinkToSource(dto.linkToSource())
                .withFavorite(dto.isFavorite());

        return recipeRepository.save(updated);
    }

    public Recipe updateFavoriteByRecipeId(String id, boolean isFavorite) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Recipe with ID=" + id + " not found"));

        Recipe updated = existing.withFavorite(isFavorite);
        return recipeRepository.save(updated);
    }
}
