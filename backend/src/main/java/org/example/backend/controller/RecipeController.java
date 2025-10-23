package org.example.backend.controller;

import org.example.backend.model.Recipe;
import org.example.backend.dto.RecipeDto;
import org.example.backend.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Recipe addRecipe(@RequestBody RecipeDto recipeDto) {
        return recipeService.addRecipe(recipeDto);
    }

    @PutMapping("/{id}/update")
    public Recipe updateRecipeById(@PathVariable String id, @RequestBody RecipeDto recipeDto) {
        return recipeService.updateRecipeById(id, recipeDto);
    }

    @PutMapping("/{id}")
    public Recipe updateFavoriteByRecipeId(@PathVariable String id, @RequestParam boolean isFavorite) {
        return recipeService.updateFavoriteByRecipeId(id, isFavorite);
    }
}
