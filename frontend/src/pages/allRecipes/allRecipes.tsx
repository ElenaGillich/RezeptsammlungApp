import type {Recipe} from "../../models/Recipe.ts";
import RecipeCard from "../../components/recipeCard/RecipeCard.tsx";
import "./allRecipes.css"

type RecipesProps = {
    recipes: Recipe[]
}

export default function AllRecipes(props: RecipesProps) {

    return (
        <>
            { props.recipes.length < 1 && <h2>Keine Rezepte vorhanden!</h2> }
            { props.recipes.length > 0 &&
                <div className="recipes container">
                    {props.recipes.sort().map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)}
                    {/*{props.recipes*/}
                    {/*    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))*/}
                    {/*    .map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)}*/}
                </div>
            }
        </>
    )
}