import type {Recipe} from "./Recipe.ts";

export type MealPlan = {
    id: string;
    name: string;
    recipes: Recipe[]
}