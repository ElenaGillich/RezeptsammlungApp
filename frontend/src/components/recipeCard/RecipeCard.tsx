import type { Recipe } from "../../models/Recipe.ts";
import "./RecipeCard.css";
import type { Ingredient } from "../../models/Ingredient.ts";
import IngredientNames from "../ingredientNames/IngredientNames.tsx";
import {handleImageError} from "../../utils/HandleImageError.ts";

type RecipeCardProps = {
    recipe: Recipe;
}

export default function RecipeCard(props: Readonly<RecipeCardProps>) {
    const favoriteIcon: string = "/red-heart.png";

    const allIngredients: string = props.recipe.ingredients
        .map((ingredient: Ingredient) => " " + ingredient.name).toString();

    return (
        <div className="small-card">
            <a href={"/recipes/" + props.recipe.id} title={props.recipe.name}>
                <div className="card-image">
                    {props.recipe.favorite && (
                        <div className="favorite-icon">
                            <img
                                width={24}
                                height={24}
                                src={favoriteIcon}
                                alt="Red heart icon"
                            />
                        </div>
                    )}
                    <img
                        className="custom-image"
                        width={props.recipe.image ? 300 : 220}
                        height={props.recipe.image ? 200 : 180}
                        src={props.recipe.image ? props.recipe.image : "/noRecipeImage.png"}
                        alt="Gerichtbild"
                        onError={handleImageError}
                    />
                </div>
                <div className="recipe-name truncated">{props.recipe.name}</div>
            </a>
            <IngredientNames ingredients={allIngredients} isRecipeCard={true} />
        </div>
    );
}
