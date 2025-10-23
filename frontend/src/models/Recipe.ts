import type {DishCategory} from "./DishCategory.ts";
import type {Ingredient} from "./Ingredient.ts";
import type {PreparationSpeed} from "./PreparationSpeed.ts";

export type Recipe = {
    id: string,
    name: string,
    category: DishCategory,
    image: string,
    ingredients: Ingredient[],
    description: string,
    speed: PreparationSpeed,
    notes: string,
    opinionOfTheDish: string,
    linkToSource: string,
    favorite: boolean,
}