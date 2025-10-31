import type {Recipe} from "../../models/Recipe.ts";
import "./RecipeCard.css"
import type {Ingredient} from "../../models/Ingredient.ts";
import {Tooltip} from "react-tooltip";

type RecipeCardProps = {
    recipe: Recipe
}

export default function RecipeCard(props: Readonly<RecipeCardProps>) {
    const noImage: string = "/noRecipeImage.png";
    const favorite: string = "/red-heart.png";

    const allIngredients: string = props.recipe.ingredients
        .map((ingredient: Ingredient) =>
            " " + ingredient.name).toString();

    return (
        <>
            <div className="small-card">
                <a href={"/recipes/" + props.recipe.id} title={props.recipe.name}>
                    <div className={"card-image"}>
                        { props.recipe.favorite &&
                            <div className={"favorite-icon"}>
                                <img
                                    width={24}
                                    height={24}
                                    src={favorite}
                                    alt="Red heart icon"
                                />
                            </div>
                        }
                        <img
                            className="custom-image"
                            width={props.recipe.image ? 300 : 220}
                            height={props.recipe.image ? 200 : 180}
                            src={props.recipe.image ? props.recipe.image : noImage}
                            alt="Gerichtbild"
                        />
                    </div>

                    <div className="recipe-name truncated">{props.recipe.name}</div>
                </a>

                <div
                    className="truncated ingredients"
                    data-tooltip-id="ingredients"
                    data-tooltip-content={allIngredients}
                    data-tooltip-place="bottom-end"
                >
                    <u>Zutaten:</u> <i>{allIngredients}</i>
                </div>

                <Tooltip id="ingredients" className="tooltip" />
            </div>
        </>
    )
}
