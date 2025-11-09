package org.example.backend.controller;

import org.example.backend.model.MealPlan;
import org.example.backend.model.Recipe;
import org.example.backend.service.MealPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal-plan")
public class MealPlanController {
    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @GetMapping("/all")
    public List<MealPlan> getAllMealPlans() {
        return mealPlanService.getAll();
    }

    @GetMapping("/{id}")
    public MealPlan getMealPlanById(@PathVariable String id) {
        return mealPlanService.getMealPlanById(id);
    }

    @PostMapping("/{id}")
    public MealPlan addRecipeToMealPlan(@PathVariable String id, @RequestBody Recipe recipe) {
        return mealPlanService.addRecipeToMealPlanById(id, recipe);
    }

    @DeleteMapping("/{id}/recipe/{recipeId}")
    public MealPlan removeRecipeFromMealPlan(@PathVariable String id, @PathVariable String recipeId) {
        return mealPlanService.removeRecipeFromMealPlan(id, recipeId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteById(@PathVariable String id) {
        mealPlanService.deleteById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MealPlan createMealPlan(@RequestBody String name) {
        return mealPlanService.createMealPlan(name);
    }
}