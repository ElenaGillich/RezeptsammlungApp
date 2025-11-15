import type {Recipe} from "../../models/Recipe.ts";
import RecipeCard from "../../components/recipeCard/RecipeCard.tsx";
import "./allRecipes.css"
import PageTitle from "../../components/pageTitle/PageTitle.tsx";

type RecipesProps = {
    recipes: Recipe[]
}

export default function AllRecipes(props: RecipesProps) {

    return (
        <>
            <PageTitle title={`Alle rezepte (${props.recipes.length})`}></PageTitle>

            <div className="recipes container">
                {
                    props.recipes.length > 0
                        ? props.recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
                        : <h2>Keine Rezepte geladen!</h2>
                }
            </div>
        </>
    )
}