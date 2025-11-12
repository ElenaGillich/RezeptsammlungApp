import type {Recipe} from "../../models/Recipe.ts";
import RecipeCard from "../../components/recipeCard/RecipeCard.tsx";
import "./allRecipes.css"

type RecipesProps = {
    recipes: Recipe[]
}

export default function AllRecipes(props: RecipesProps) {

    return (
        <>
            <p className="page-title">Alle rezepte ({props.recipes.length})</p>

            <div className="recipes container">
                {props.recipes.length < 1 && <h2>Keine Rezepte geladen!</h2>}
                {props.recipes.length > 0 && props.recipes.map(recipe =>
                    <RecipeCard key={recipe.id} recipe={recipe}/>)
                }
            </div>
        </>
    )
}