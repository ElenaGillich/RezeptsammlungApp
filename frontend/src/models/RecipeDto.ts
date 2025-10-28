import type {Ingredient} from "./Ingredient.ts";

export type RecipeDto = {
    name: string;
    category: string;
    image: string;
    ingredients: Ingredient[];
    description: string;
    speed: string;
    notes: string;
    opinionOfTheDish: string;
    linkToSource: string;
    favorite: boolean;
}
