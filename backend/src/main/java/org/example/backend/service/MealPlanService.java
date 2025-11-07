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

    public MealPlan addRecipeToMealPlanById(String mailPlanId, Recipe newRecipe) {
        MealPlan existingPlan = mealPlanRepository.findById(mailPlanId).orElseThrow(
                () -> new NoSuchElementException("Speisekarte mit ID=" + mailPlanId + " nicht gefunden!"));

        List<Recipe> recipeList = new ArrayList<>(existingPlan.getRecipes());

        boolean alreadyExists = recipeList.stream()
                .anyMatch(recipe -> recipe.getId().equals(newRecipe.getId()));

        if (alreadyExists) {
            return existingPlan;
        } else {
            recipeList.add(newRecipe);
            MealPlan updated = existingPlan.withRecipes(recipeList);
            return mealPlanRepository.save(updated);
        }
    }

    public MealPlan createMealPlan(String name) {
        MealPlan mealPlan = new MealPlan(idService.randomId(), name, List.of());
        return mealPlanRepository.save(mealPlan);
    }

    public void deleteById(String id) {
        mealPlanRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Speisekarte mit ID=" + id + " nicht gefunden!"));

        mealPlanRepository.deleteById(id);
    }
}
