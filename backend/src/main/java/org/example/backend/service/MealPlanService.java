package org.example.backend.service;

import org.example.backend.model.MealPlan;
import org.example.backend.model.Recipe;
import org.example.backend.repository.MealPlanRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final IdService idService;

    public MealPlanService(MealPlanRepository mealPlanRepository, IdService idService) {
        this.mealPlanRepository = mealPlanRepository;
        this.idService = idService;
    }

    public List<MealPlan> getAll() {
        return mealPlanRepository.findAll();
    }

    public MealPlan getMealPlanById(String id) {
        return mealPlanRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Speisekarte mit ID=" + id + " nicht gefunden!"));
    }

    public MealPlan addRecipeToMealPlanById(String mealPlanId, Recipe newRecipe) {
        MealPlan existingPlan = getMealPlanById(mealPlanId);
        List<Recipe> recipeList = new ArrayList<>(existingPlan.getRecipes());

        boolean alreadyExists = recipeList.stream()
                .anyMatch(recipe -> recipe.getId().equals(newRecipe.getId()));

        if (alreadyExists) {
            return existingPlan;
        }

        recipeList.add(newRecipe);
        return saveUpdatedMealPlan(existingPlan, recipeList);
    }

    public MealPlan removeRecipeFromMealPlan(String mealPlanId, String recipeId) {
        MealPlan existingPlan = getMealPlanById(mealPlanId);
        List<Recipe> recipes = new ArrayList<>(existingPlan.getRecipes());

        boolean removed = recipes.removeIf(r -> r.getId().equals(recipeId));
        if (!removed) {
            return existingPlan;
        }

        return saveUpdatedMealPlan(existingPlan, recipes);
    }

    public MealPlan createMealPlan(String name) {
        MealPlan mealPlan = new MealPlan(idService.randomId(), name, List.of());
        return mealPlanRepository.save(mealPlan);
    }

    public void deleteById(String id) {
        getMealPlanById(id);

        mealPlanRepository.deleteById(id);
    }

    private MealPlan saveUpdatedMealPlan(MealPlan existingPlan, List<Recipe> recipes) {
        MealPlan updated = existingPlan.withRecipes(recipes);
        return mealPlanRepository.save(updated);
    }
}
