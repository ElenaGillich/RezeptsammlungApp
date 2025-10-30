package org.example.backend.controller;

import org.example.backend.RecipeRepository;
import org.example.backend.model.DishCategory;
import org.example.backend.model.Ingredient;
import org.example.backend.model.PreparationSpeed;
import org.example.backend.model.Recipe;
import org.example.backend.service.IdService;
import org.example.backend.service.ImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    private IdService idService;

    @MockitoBean
    ImageService imageService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllRecipes_shouldReturnListWithOneRecipe_whenCalled() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/recipes"))
        //THEN
                .andExpect(status().isOk())
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
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/recipes"))
        //THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]"));
    }

    @Test
    void updateRecipeById_shouldReturnUpdatedRecipe_whenCalledWithDto() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);
        MockMultipartFile json = getMockMultipartFile();
        MockMultipartFile file = new MockMultipartFile("file", "fake image content".getBytes());

        //WHEN
        when(imageService.uploadImage(any())).thenReturn("https://mock.cloudinary.com/image.jpg");

        mockMvc.perform(multipart("/api/recipes/1/update")
                .file(json)
                .file(file)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
        //THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                          {
                          "id": "1",
                          "name": "Tomaten-Salat mit Sauerrahm",
                          "category": "SALAD",
                          "image": "https://mock.cloudinary.com/image.jpg",
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

    private static MockMultipartFile getMockMultipartFile() {
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
        MockMultipartFile json = new MockMultipartFile("data", null, MediaType.APPLICATION_JSON_VALUE, dto.getBytes());
        return json;
    }

    @Test
    void updateRecipeById_shouldThrowException_whenCalledWithInvalidId() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);
        MockMultipartFile json = getMockMultipartFile();
        MockMultipartFile file = new MockMultipartFile("file", "fake image content".getBytes());

        //WHEN
        when(imageService.uploadImage(any())).thenReturn("https://mock.cloudinary.com/image.jpg");

        mockMvc.perform(multipart("/api/recipes/gffhfz23654dhgf9gh/update")
                .file(json)
                .file(file)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
        //THEN
                .andExpect(status().is4xxClientError())
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString("Recipe with ID=gffhfz23654dhgf9gh not found")));
    }

    //TODO: add more updateRecipe tests after adding of validation

    @Test
    void updateFavoriteByRecipeId_shouldChangeFavoriteStatus() throws Exception {
        //GIVEN
        recipeRepository.save(recipe);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/recipes/1/favorite")
                        .param("isFavorite", "true"))
        //THEN
                .andExpect(status().isOk())
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