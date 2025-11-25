package org.example.backend.service;

import org.example.backend.repository.RecipeRepository;
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
    private final IdService mockIdService = mock(IdService.class);
    private final RecipeService recipeService = new RecipeService(mockRepo, mockIdService);

    Recipe recipe = Recipe.builder()
            .id("1")
            .name("Tomatensalat mit Schmand")
            .category(DishCategory.SALAD.getValue())
            .image("image")
            .speed(PreparationSpeed.FAST)
            .ingredients(List.of(
                    new Ingredient("Tomaten", 3, "Stück", "In Scheiben geschnitten"),
                    new Ingredient("Salz", 1, "Prise", ""),
                    new Ingredient("Schmand", 100, "g", "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen")
            ))
            .description("Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.")
            .favorite(false)
            .linkToSource("")
            .opinionOfTheDish("")
            .notes("")
            .build();

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
            recipe.getFavorite()
    );

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
    void addRecipe_shouldReturnNewCreatedRecipe() {
        //GIVEN
        Recipe expected = recipe
                .withName(dto.name())
                .withImage(dto.image())
                .withNotes(dto.notes());

        //WHEN
        when(mockIdService.randomId()).thenReturn("1");
        when(mockRepo.save(expected)).thenReturn(expected);

        Recipe actual = recipeService.addRecipe(dto);

        //THEN
        verify(mockIdService).randomId();
        verify(mockRepo).save(expected);
        assertEquals(expected, actual);
    }

    @Test
    void addRecipe_shouldReturnNewRecipeWithDefaultValues() {
        //GIVEN
        RecipeDto recipeDto = dto
                .withName("")
                .withCategory(null)
                .withSpeed(null);

        Recipe expected = recipe
                .withName("Rezept-1")
                .withImage(dto.image())
                .withNotes(dto.notes())
                .withCategory(DishCategory.OTHER.getValue())
                .withSpeed(PreparationSpeed.FAST);

        //WHEN
        when(mockIdService.randomId()).thenReturn("1");
        when(mockRepo.save(expected)).thenReturn(expected);

        Recipe actual = recipeService.addRecipe(recipeDto);

        //THEN
        verify(mockIdService).randomId();
        verify(mockRepo).save(expected);
        assertEquals(expected, actual);
    }

    @Test
    void updateRecipe_shouldSaveNewDataForGivenRecipe() {
        //GIVEN
        Recipe updatedRecipe = recipe
                .withName(dto.name())
                .withImage(dto.image())
                .withNotes(dto.notes());

        //WHEN
        when(mockRepo.findById("1")).thenReturn(Optional.ofNullable(recipe));
        when(mockRepo.save(updatedRecipe)).thenReturn(updatedRecipe);

        Recipe actual = recipeService.updateRecipeById("1", dto);

        //THEN
        verify(mockRepo).findById("1");
        verify(mockRepo).save(updatedRecipe);
        assertEquals(updatedRecipe, actual);
    }

    @Test
    void updateRecipe_shouldThrowException_whenCalledWithNotExistingRecipeId() {
        //WHEN
        when(mockRepo.findById("1nzu98349df7gtz345")).thenReturn(Optional.empty());

        //THEN
        assertThrows(NoSuchElementException.class, () -> recipeService
                .updateRecipeById("1nzu98349df7gtz345", dto), "Recipe with ID=1nzu98349df7gtz345 not found");
        verify(mockRepo).findById("1nzu98349df7gtz345");
    }

    @Test
    void updateFavoriteByRecipeId_shouldReturnRecipeWithTrueFavorite_whenCalledWithFalse() {
        //GIVEN
        Recipe updatedRecipe = recipe
                .withFavorite(true);

        when(mockRepo.findById("1")).thenReturn(Optional.ofNullable(recipe));
        when(mockRepo.save(updatedRecipe)).thenReturn(updatedRecipe);

        //WHEN
        Recipe actual = recipeService.updateFavoriteByRecipeId("1", true);

        //THEN
        verify(mockRepo).findById("1");
        verify(mockRepo).save(updatedRecipe);
        assertEquals(updatedRecipe, actual);
    }

    @Test
    void updateFavoriteByRecipeId_shouldThrowException_whenCalledWithInvalidId() {
        //WHEN
        when(mockRepo.findById("1")).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class, () -> recipeService.updateFavoriteByRecipeId("1", true)
        );

        //THEN
        assertEquals("Recipe with ID=1 not found", exception.getMessage());

        verify(mockRepo).findById("1");
        verify(mockRepo, never()).save(any());
        verifyNoMoreInteractions(mockRepo);
    }

    @Test
    void deleteRecipeById_shouldDeleteRecipe_whenCalledWithValidId() {
        //WHEN
        when(mockRepo.findById("1")).thenReturn(Optional.ofNullable(recipe));

        recipeService.deleteRecipeById("1");

        //THEN
        verify(mockRepo).findById("1");
        verify(mockRepo).deleteById("1");
    }

    @Test
    void deleteRecipeById_shouldThrowException_whenCalledWithInvalidId() {
        //GIVEN
        String recipeId = "123";

        //WHEN
        when(mockRepo.findById(recipeId)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class, () -> recipeService.deleteRecipeById(recipeId)
        );

        //THEN
        assertEquals("Recipe with ID=123 not found", exception.getMessage());

        verify(mockRepo).findById(recipeId);
        verify(mockRepo, never()).deleteById(anyString());
        verifyNoMoreInteractions(mockRepo);
    }

    @Test
    void getRecipeById_shouldThrowException_whenCalledWithInvalidId() {
        //GIVEN
        String recipeId = "1";

        //WHEN
        when(mockRepo.findById(recipeId)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class, () -> recipeService.getRecipeById(recipeId)
        );

        //THEN
        assertEquals("Recipe with ID=1 not found", exception.getMessage());

        verify(mockRepo).findById(recipeId);
    }

    @Test
    void getRecipeById_shouldReturnRecipe_whenCalledWithValidId() {
        //GIVEN
        String recipeId = "1";
        mockRepo.save(recipe);

        //WHEN
        when(mockRepo.findById(recipeId)).thenReturn(Optional.of(recipe));
        Recipe actual = recipeService.getRecipeById(recipeId);

        //THEN
        verify(mockRepo).findById(recipeId);
        assertEquals(recipe, actual);
    }
}