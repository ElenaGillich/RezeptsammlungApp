package org.example.backend.controller;

import org.example.backend.model.*;
import org.example.backend.repository.MealPlanRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class MealPlanControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MealPlanRepository mockRepository;

    Recipe recipe = Recipe.builder()
            .id("1")
            .name("Tomatensalat mit Schmand")
            .category(DishCategory.SALAD)
            .image("image")
            .speed(PreparationSpeed.FAST)
            .ingredients(List.of(
                    new Ingredient("Tomaten", 3, "Stück", "saftig und lecker"),
                    new Ingredient("Salz", 0.25, "TL", ""),
                    new Ingredient("Schmand", 100, "g", "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen")
            ))
            .description("Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.")
            .favorite(false)
            .linkToSource("")
            .opinionOfTheDish("")
            .notes("")
            .build();

    MealPlan testPlan = new MealPlan("mp1", "Test", List.of(recipe));

    String recipeJson = """
        {
            "id": "1",
            "name": "Tomatensalat mit Schmand",
            "category": "SALAD",
            "image": "image",
            "speed": "FAST",
            "ingredients": [
                {"name": "Tomaten", "quantity": 3, "unit": "Stück", "additionalInfo": "saftig und lecker"},
                {"name": "Salz", "quantity": 0.25, "unit": "TL", "additionalInfo": ""},
                {"name": "Schmand", "quantity": 100, "unit": "g", "additionalInfo": "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen"}
            ],
            "description": "Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.",
            "favorite": false
        }
        """;

    String mealPlanJson = """
        {
            "name": "Test",
            "recipes": ["""
                .concat(recipeJson).concat(
            """
            ]
        }
        """);

    String mealPlanEmptyJson = """
        {
            "name": "Test",
            "recipes": []
        }
        """;

    @Test
    void getAllRecipes_shouldReturnEmptyList_whenCalled() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/meal-plan/all"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]"));
    }

    @Test
    void getAllMealPlans_shouldReturnListWithOneRecipe_whenCalled() throws Exception {
        mockRepository.save(testPlan);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/meal-plan/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[".concat(mealPlanJson).concat("]")));
    }

    @Test
    void getMealPlanById_shouldReturnMealPlan_whenCalledWithValidId () throws Exception {
        mockRepository.save(testPlan);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/meal-plan/" + testPlan.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(mealPlanJson));
    }

    @Test
    void addRecipeToMealPlan_shouldReturnMealPlanWithGivenRecipe() throws Exception {
        mockRepository.save(new MealPlan("mp1", "Test", List.of()));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/meal-plan/mp1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(recipeJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(mealPlanJson));
    }

    @Test
    void removeRecipeFromMealPlan_shouldReturnPlanWithEmptyRecipeList() throws Exception {
        mockRepository.save(testPlan);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/meal-plan/mp1/recipe/1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(mealPlanEmptyJson));
    }

    @Test
    void deleteMealPlanById_shouldRemoveMealPlan_whenCalledWithValidId() throws Exception {
        mockRepository.save(testPlan);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/meal-plan/" + testPlan.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void deleteMealPlanById_whenInvalidID_thenStatus404() throws Exception {
        mockRepository.save(testPlan);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/meal-plan/xyz"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Speisekarte mit ID=xyz nicht gefunden!"));
    }

    @Test
    void createMealPlan_shouldReturnNewMealPlan() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/meal-plan")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("Test"))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json(mealPlanEmptyJson));
    }
}