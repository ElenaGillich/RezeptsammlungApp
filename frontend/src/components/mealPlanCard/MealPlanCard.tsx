import type {MealPlan} from "../../models/MealPlan.ts";
import type {Recipe} from "../../models/Recipe.ts";
import type {Ingredient} from "../../models/Ingredient.ts";
import "./MealPlanCard.css";
import {useState} from "react";

type MealPlanCardProps = {
    mealPlan: MealPlan;
    isActive: boolean;
    onRemoveMealPlan: (planId: string) => void;
};

export default function MealPlanCard(props: MealPlanCardProps) {
    const {mealPlan, isActive} = props;
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false);

    function removeRecipe(recipe: Recipe) {
        console.log("Remove recipe: ", recipe);
    }

    return (
        <>
            <div className={`card-box ${isActive ? "active" : ""}`}>
                <div className={`card-header ${isActive ? "header-active" : ""}`}>
                    <h4>{mealPlan.name}</h4>

                    <div className="buttons">
                        {(isActive && !isDisplayed) &&
                            <button
                                type="button"
                                className="action-button"
                                onClick={() => setIsDisplayed(true)}
                            >
                                <img
                                    width={34}
                                    height={32}
                                    src="/grocery.png"
                                    alt="Grocery-Icon"
                                />
                            </button>}

                        <button
                            type="button"
                            className="action-button"
                            onClick={() => props.onRemoveMealPlan(mealPlan.id)}
                        >
                            <img
                                width={26}
                                height={26}
                                src="/delete.png"
                                alt="Delete-Icon"
                            />
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <ul className="list">
                        {mealPlan.recipes.map((recipe) => (
                            <li key={recipe.id}>
                                <div className="list-item">
                                    <h4>{recipe.name}</h4>
                                    <div className="products">
                                        ({recipe.ingredients
                                        .map((ingredient: Ingredient) => " " + ingredient.name).toString()}
                                        )
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => removeRecipe(recipe)}
                                >
                                    <b>x</b>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {(isActive && isDisplayed) &&
                <div className="products">
                    <div className="close">
                        <button
                            type="button"
                            className="custom-button"
                            onClick={() => setIsDisplayed(false)}
                        >x</button>
                    </div>

                    {mealPlan.recipes.map((recipe) =>
                        <div key={recipe.id}>
                            <h4 className="recipe-title">{recipe.name}</h4>
                            <ul>
                                {recipe.ingredients.map((ing) =>
                                    <li key={ing.name}>{ing.name} - {ing.quantity} {ing.unit}</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            }
        </>
    );
}