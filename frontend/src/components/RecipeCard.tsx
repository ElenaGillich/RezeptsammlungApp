import type {Recipe} from "../models/Recipe.ts";
import "./RecipeCard.css"
import type {Ingredient} from "../models/Ingredient.ts";
import {Tooltip} from "react-tooltip";

type RecipeCardProps = {
    recipe: Recipe
}

export default function RecipeCard(props: RecipeCardProps) {
    const allIngredients: string[] = props.recipe.ingredients
        .map((ingredient: Ingredient, index: number) =>
            " " + ingredient.name + (index < props.recipe.ingredients.length - 1 ? "," : ""));

    return (
        <>
            <div className="small-card">
                <a href="/" title={props.recipe.name}>
                    <div className={"card-image"}>
                        <img
                            width={props.recipe.image.length > 0 ? 230 : 158}
                            height={props.recipe.image.length > 0 ? 170 : 150}
                            src={props.recipe.image.length > 0 ? props.recipe.image : "src/assets/noImageOfRecipe.jpg"}
                            alt="Gerichtbild"
                        />
                    </div>

                    <div className="recipe-name truncated">{props.recipe.name}</div>

                    <Tooltip id="recipe-name" className="tooltip">
                        {props.recipe.name}
                    </Tooltip>
                </a>

                <div
                    className="truncated ingredients"
                    data-tooltip-id="ingredients"
                    data-tooltip-place="bottom-end"
                >
                    <u>Zutaten:</u> <i>{allIngredients}</i>
                </div>

                <Tooltip id="ingredients" className="tooltip">
                    { allIngredients }
                </Tooltip>
            </div>
        </>
    )
}
