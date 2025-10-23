package org.example.backend.service;

import org.example.backend.RecipeRepository;
import org.example.backend.dto.RecipeDto;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;
import org.example.backend.model.Recipe;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class RecipeServiceTest {

    private final RecipeRepository mockRepo = mock(RecipeRepository.class);
    private final RecipeService recipeService = new RecipeService(mockRepo);
    Recipe recipe = Recipe.builder()
            .id("1")
            .name("Tomatensalat mit Schmand")
            .category(DishCategory.SALAD)
            .image("image")
            .speed(PreparationSpeed.FAST)
            .ingredients(List.of(
                    new Ingredient("Tomaten", 3, "Stück", "In Scheiben geschnitten"),
                    new Ingredient("Salz", 1, "Prise", ""),
                    new Ingredient("Schmand", 100, "g", "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen")
            ))
            .description("Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.")
            .isFavorite(false)
            .linkToSource("")
            .opinionOfTheDish("")
            .notes("")
            .build();

    @Test
    void getAllRecipes_shouldReturnEmptyList() {
        //GIVEN
        when(mockRepo.findAll()).thenReturn(List.of());

        //WHEN
        List<Recipe> actual = recipeService.getAllRecipes();

        //THEN
        assertTrue(actual.isEmpty());
        verify(mockRepo).findAll();
    }

    @Test
    void getAllRecipes_shouldReturnListWithOneRecipe() {
        //GIVEN
        List<Recipe> expected = List.of(recipe);
        when(mockRepo.findAll()).thenReturn(expected);

        //WHEN
        List<Recipe> actual = recipeService.getAllRecipes();

        //THEN
        assertEquals(expected, actual);
        verify(mockRepo).findAll();
    }

    @Test
    void updateRecipe_shouldSaveNewDataForGivenRecipe() {
        //GIVEN
        RecipeDto dto = new RecipeDto(
                "Tomaten-Salat mit Sauerrahm",
                recipe.getCategory(),
                "",
                recipe.getIngredients(),
                recipe.getDescription(),
                recipe.getSpeed(),
                "Tomaten sollen am besten frisch, lecker und saftig sein.",
                recipe.getOpinionOfTheDish(),
                recipe.getLinkToSource(),
                recipe.isFavorite()
        );

        Recipe updatedRecipe = recipe
                .withName(dto.name())
                .withImage(dto.image())
                .withNotes(dto.notes());

        when(mockRepo.findById("1")).thenReturn(Optional.ofNullable(recipe));
        when(mockRepo.save(updatedRecipe)).thenReturn((updatedRecipe));

        //WHEN
        Recipe actual = recipeService.updateRecipeById("1", dto);

        //THEN
        verify(mockRepo).findById("1");
        verify(mockRepo).save(updatedRecipe);
        assertEquals(updatedRecipe, actual);
    }

    @Test
    void updateRecipe_shouldThrowException_whenCalledWithNotExistingRecipeId() {
        //GIVEN
        RecipeDto dto = new RecipeDto(
                "Tomaten-Salat mit Sauerrahm",
                recipe.getCategory(),
                "",
                recipe.getIngredients(),
                recipe.getDescription(),
                recipe.getSpeed(),
                "Tomaten sollen am besten frisch, lecker und saftig sein.",
                recipe.getOpinionOfTheDish(),
                recipe.getLinkToSource(),
                recipe.isFavorite()
        );

        //WHEN
        when(mockRepo.findById("1nzu98349df7gtz345")).thenReturn(Optional.empty());

        //THEN
        assertThrows(NoSuchElementException.class, () -> recipeService
                .updateRecipeById("1nzu98349df7gtz345", dto), "Recipe with ID=1nzu98349df7gtz345 not found");
        verify(mockRepo).findById("1nzu98349df7gtz345");
    }
}