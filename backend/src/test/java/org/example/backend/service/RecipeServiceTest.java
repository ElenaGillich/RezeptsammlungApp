package org.example.backend.service;

import org.example.backend.RecipeRepository;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;
import org.example.backend.model.Recipe;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class RecipeServiceTest {

    private final RecipeRepository mockRepo = mock(RecipeRepository.class);
    private final RecipeService recipeService = new RecipeService(mockRepo);

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
        List<Recipe> expected = List.of(
                Recipe.builder()
                        .id("1")
                        .name("Tomatensalat mit Schmand")
                        .category(DishCategory.SALAD)
                        .image("image")
                        .speed(PreparationSpeed.FAST)
                        .ingredients(List.of(
                                new Ingredient("Tomaten", 3, "Stück", "saftig und lecker"),
                                new Ingredient("Salz", 1, "Prise", ""),
                                new Ingredient("Schmand", 100, "g", "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen")
                        ))
                        .description("Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.")
                        .isFavorite(false)
                        .linkToSource("")
                        .opinionOfTheDish("")
                        .notes("")
                        .build()
        );
        when(mockRepo.findAll()).thenReturn(expected);

        //WHEN
        List<Recipe> actual = recipeService.getAllRecipes();

        //THEN
        assertEquals(expected, actual);
        verify(mockRepo).findAll();
    }
}