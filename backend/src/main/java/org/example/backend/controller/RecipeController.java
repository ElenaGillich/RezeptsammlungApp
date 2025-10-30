package org.example.backend.controller;

import org.example.backend.model.Recipe;
import org.example.backend.dto.RecipeDto;
import org.example.backend.service.ImageService;
import org.example.backend.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;
    private final ImageService imageService;

    public RecipeController(RecipeService recipeService, ImageService imageService) {
        this.recipeService = recipeService;
        this.imageService = imageService;
    }

    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Recipe addNewRecipe(
        @RequestPart(name = "data") RecipeDto dto,
        @RequestPart(name = "file", required = false) MultipartFile image
    ) throws IOException {
        String imageUrl = imageService.uploadImage(image);

        return recipeService.addRecipe(dto.withImage(imageUrl));
    }

    @PutMapping("/{id}/update")
    public Recipe updateRecipeById(
            @RequestPart(name = "data") RecipeDto recipeDto,
            @RequestPart(name = "file", required = false) MultipartFile image,
            @PathVariable String id
    ) throws IOException {
        RecipeDto dto = recipeDto;
        if (image != null) {
            String imageUrl = imageService.uploadImage(image);
            dto = recipeDto.withImage(imageUrl);
        }

        return recipeService.updateRecipeById(id, dto);
    }

    @PutMapping("/{id}/favorite")
    public Recipe updateFavoriteByRecipeId(@PathVariable String id, @RequestParam boolean isFavorite) {
        return recipeService.updateFavoriteByRecipeId(id, isFavorite);
    }

    @GetMapping("/{id}")
    public Recipe getRecipeById(@PathVariable String id) {
        return recipeService.getRecipeById(id);
    }
}
