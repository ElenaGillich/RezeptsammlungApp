package org.example.backend.service;

import org.example.backend.RecipeRepository;
import org.example.backend.dto.RecipeDto;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;
import org.example.backend.model.Recipe;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final IdService idService;

    public RecipeService(RecipeRepository recipeRepository, IdService idService) {
        this.recipeRepository = recipeRepository;
        this.idService = idService;
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

    public Recipe addRecipe(RecipeDto recipeDto) {
        String recipeID = idService.randomId();
        Recipe newRecipe = Recipe.builder()
                .id(recipeID)
                .name(recipeDto.name().trim().isEmpty() ? "Rezept-"+recipeID : recipeDto.name().trim())
                .category(recipeDto.category() == null ? DishCategory.OTHER : recipeDto.category() )
                .image(recipeDto.image())
                .speed(recipeDto.speed())
                .ingredients(recipeDto.ingredients())
                .description(recipeDto.description())
                .isFavorite(recipeDto.isFavorite())
                .linkToSource(recipeDto.linkToSource())
                .opinionOfTheDish(recipeDto.opinionOfTheDish())
                .notes(recipeDto.notes())
                .build();

        return recipeRepository.save(newRecipe);
    }
}
