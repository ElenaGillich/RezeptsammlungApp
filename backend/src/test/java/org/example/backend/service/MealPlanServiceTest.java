package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repository.MealPlanRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class MealPlanServiceTest {

    private final MealPlanRepository mockRepo = mock(MealPlanRepository.class);
    private final IdService idServiceMock = mock(IdService.class);
    MealPlanService mealPlanService = new MealPlanService(mockRepo, idServiceMock);

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
            .favorite(false)
            .linkToSource("")
            .opinionOfTheDish("")
            .notes("")
            .build();

    MealPlan testPlan = new MealPlan("mp1", "Test", List.of(recipe));

    @Test
    void getAll_shouldReturnListWithOneMealPlan() {
        //GIVEN
        List<MealPlan> expected = List.of(testPlan);

        //WHEN
        when(mockRepo.findAll()).thenReturn(expected);
        List<MealPlan> actual = mealPlanService.getAll();

        //THEN
        assertNotNull(actual);
        assertEquals(1, actual.size());
        assertEquals(expected, actual);
        verify(mockRepo).findAll();
    }

    @Test
    void getAll_shouldReturnEmptyList() {
        //GIVEN
        //WHEN
        when(mockRepo.findAll()).thenReturn(List.of());

        List<MealPlan> actual = mealPlanService.getAll();

        //THEN
        assertTrue(actual.isEmpty());
        verify(mockRepo).findAll();
    }

    @Test
    void getMealPlanById_shouldReturnMealPlan() {
        //GIVEN
        //WHEN
        when(mockRepo.findById(testPlan.getId())).thenReturn(Optional.of(testPlan));
        MealPlan actual = mealPlanService.getMealPlanById(testPlan.getId());

        //THEN
        assertNotNull(actual);
        assertEquals(testPlan, actual);
        verify(mockRepo).findById(testPlan.getId());
    }

    @Test
    void getMealPlanById_shouldThrowException_whenMealPlanNotFound() {
        //GIVEN
        String mealPlanId = "1";

        //WHEN
        when(mockRepo.findById(mealPlanId)).thenReturn(Optional.empty());
        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class, () -> mealPlanService.getMealPlanById(mealPlanId)
        );

        //THEN
        assertEquals("Speisekarte mit ID=1 nicht gefunden!", exception.getMessage());
        verify(mockRepo).findById(mealPlanId);
    }

    @Test
    void createMealPlan_shouldReturnMealPlanWithGivenName() {
        //GIVEN
        String planName = "Test";

        //WHEN
        when(idServiceMock.randomId()).thenReturn(testPlan.getId());
        when(mockRepo.save(any())).thenReturn(testPlan);
        MealPlan actual = mealPlanService.createMealPlan(planName);

        //THEN
        assertNotNull(actual);
        assertEquals(testPlan.getName(), actual.getName());
        verify(mockRepo).save(any());
    }

    @Test
    void addRecipeToMealPlanById_shouldReturnMealPlanWithOneRecipe_whenValidMailPlanId() {
        //GIVEN
        MealPlan expected = testPlan;
        MealPlan existed = new MealPlan("mp1", "Test", List.of());
        assertEquals(0, existed.getRecipes().size());

        //WHEN
        when(mockRepo.findById(testPlan.getId())).thenReturn(Optional.of(existed));
        when(mockRepo.save(any())).thenReturn(expected);

        MealPlan actual = mealPlanService.addRecipeToMealPlanById(existed.getId(), recipe);

        //THEN
        assertEquals(expected, actual);
        assertEquals(1, actual.getRecipes().size());
    }

    @Test
    void removeRecipeFromMealPlan() {
        //GIVEN
        MealPlan expected = new MealPlan("mp1", "Test", List.of());

        //WHEN
        when(mockRepo.findById(testPlan.getId())).thenReturn(Optional.of(testPlan));
        when(mockRepo.save(any())).thenReturn(expected);

        MealPlan actual = mealPlanService.removeRecipeFromMealPlan(testPlan.getId(), recipe.getId());

        //THEN
        assertEquals(expected, actual);
    }

    @Test
    void deleteMealPlanById_shouldDeleteRecipe_whenCalledWithValidId() {
        //GIVEN
        //WHEN
        when(mockRepo.findById("1")).thenReturn(Optional.ofNullable(testPlan));

        mealPlanService.deleteMealPlanById("1");

        //THEN
        verify(mockRepo).findById("1");
        verify(mockRepo).deleteById("1");
    }

    @Test
    void deleteMealPlanById_shouldThrowException_whenCalledWithInvalidId() {
        //GIVEN
        String mealPlanId = "123";

        //WHEN
        when(mockRepo.findById(mealPlanId)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class, () -> mealPlanService.deleteMealPlanById(mealPlanId)
        );

        //THEN
        assertEquals("Speisekarte mit ID=123 nicht gefunden!", exception.getMessage());
        verify(mockRepo).findById(mealPlanId);
        verify(mockRepo, never()).deleteById(anyString());
        verifyNoMoreInteractions(mockRepo);
    }
}