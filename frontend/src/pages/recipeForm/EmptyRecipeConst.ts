import type {RecipeDto} from "../../models/RecipeDto.ts";

export const  emptyRecipeDto: RecipeDto = {
    name: "",
    category: "",
    image: "",
    ingredients: [],
    description: "",
    speed: "",
    notes: "",
    opinionOfTheDish: "",
    linkToSource: "",
    favorite: false
}