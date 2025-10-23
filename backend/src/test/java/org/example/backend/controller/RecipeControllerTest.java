package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.RecipeRepository;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;
import org.example.backend.model.Recipe;
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

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class RecipeControllerTest {
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
            .isFavorite(false)
            .linkToSource("")
            .opinionOfTheDish("")
            .notes("")
            .build();

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllRecipes_shouldReturnListWithOneRecipe_whenCalled() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/recipes"))
                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                        [
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
                          description: "Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen."
                          }
                        ]
                        """));
    }

    @Test
    void getAllRecipes_shouldReturnEmptyList_whenCalled() throws Exception {
        //GIVEN
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/recipes"))
                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]"));
    }

    @Test
    void updateRecipeById_shouldReturnUpdatedRecipe_whenCalledWithDto() throws Exception {
        recipeRepository.save(recipe);

        String dto = """
                  {
                  "name": "Tomaten-Salat mit Sauerrahm",
                  "category": "SALAD",
                  "image": "",
                  "speed": "FAST",
                  "ingredients": [
                    {"name": "Tomaten", "quantity": 3, "unit": "Stück", "additionalInfo": "in Scheiben geschnitten"},
                    {"name": "Salz", "quantity": 0.25, "unit": "TL", "additionalInfo": ""},
                    {"name": "Schmand", "quantity": 100, "unit": "g", "additionalInfo": "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen"}
                  ],
                  "description": "Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.",
                  "notes": "Tomaten sollen am besten frisch, lecker und saftig sein."
                  }
                """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/recipes/1/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dto))
                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                          {
                          "id": "1",
                          "name": "Tomaten-Salat mit Sauerrahm",
                          "category": "SALAD",
                          "image": "",
                          "speed": "FAST",
                          "ingredients": [
                            {"name": "Tomaten", "quantity": 3, "unit": "Stück", "additionalInfo": "in Scheiben geschnitten"},
                            {"name": "Salz", "quantity": 0.25, "unit": "TL", "additionalInfo": ""},
                            {"name": "Schmand", "quantity": 100, "unit": "g", "additionalInfo": "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen"}
                          ],
                          "description": "Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.",
                          "notes": "Tomaten sollen am besten frisch, lecker und saftig sein."
                          }
                        """));
    }

    @Test
    void updateRecipeById_shouldThrowException_whenCalledWithInvalidId() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);

        String dto = """
                  {
                  "name": "Tomaten-Salat mit Sauerrahm",
                  "category": "SALAD",
                  "image": "",
                  "speed": "FAST",
                  "ingredients": [
                    {"name": "Tomaten", "quantity": 3, "unit": "Stück", "additionalInfo": "in Scheiben geschnitten"},
                    {"name": "Salz", "quantity": 0.25, "unit": "TL", "additionalInfo": ""},
                    {"name": "Schmand", "quantity": 100, "unit": "g", "additionalInfo": "Man kann Creme Fraiche, Sauer Rahm oder Griechischer Yogurt (10%) benutzen"}
                  ],
                  "description": "Alle Zutaten miteinander vermischen. Nach Belieben können Sie Zwiebeln und/oder Kräuter (z. B. Dill) hinzufügen.",
                  "notes": "Tomaten sollen am besten frisch, lecker und saftig sein."
                  }
                """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/recipes/gffhfz23654dhgf9gh/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dto))
                //THEN
                .andExpect(MockMvcResultMatchers.status().is4xxClientError())
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString("Recipe with ID=gffhfz23654dhgf9gh not found")));
    }

    //TODO: add more updateRecipe tests after adding of validation

    @Test
    void updateFavoriteByRecipeId_shouldChangeFavoriteStatus() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/recipes/1")
                        .param("isFavorite", "true"))
                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
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
                          "notes": "",
                          "favorite": true
                          }
                        """));
    }
}