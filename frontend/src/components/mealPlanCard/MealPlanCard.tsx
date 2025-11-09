import type {MealPlan} from "../../models/MealPlan.ts";
import "./MealPlanCard.css";
import {useState} from "react";
import {DishCategory} from "../../models/DishCategory.ts";
import axios from "axios";

type MealPlanCardProps = {
    mealPlan: MealPlan;
    isActive: boolean;
    onRemoveMealPlan: (planId: string) => void;
};

export default function MealPlanCard(props: MealPlanCardProps) {
    const isActive = props.isActive;
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
    const [mealPlan, setMealPlan] = useState<MealPlan>(props.mealPlan);

    function removeRecipe(recipeId: string) {
        axios.delete(`/api/meal-plan/${mealPlan.id}/recipe/${recipeId}`)
            .then((result) => {
                setMealPlan(result.data);
            })
            .catch((error) => alert("Fehler beim Entfernen des Rezepts vom Speiseplan: " + error));
    }

    function showBodyContent() {
        const dishCategories = Array.from(new Set(mealPlan.recipes
            .map((recipe) => recipe.category)));

        return (
            dishCategories.map(category =>
                <div className="plan-list" key={category}>
                    <p className="category left">{DishCategory[category as keyof typeof DishCategory]}</p>

                    <ul className="list">
                        {mealPlan.recipes.map(recipe => recipe.category !== category ? "" :
                            <li className="list-item" key={recipe.id}>
                                <div className="left">{recipe.name}</div>
                                <div className="right">
                                    <button
                                        type="button"
                                        className="icon-button"
                                        onClick={() => removeRecipe(recipe.id)}
                                    >x</button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            )
        );
    }

    return (
        <>
            <div className={`card-box ${isActive ? "active" : ""}`}>
                <div className={`card-header ${isActive ? "header-active" : ""}`}>
                    <h4>{mealPlan.name}</h4>

                    <div className="buttons">
                        {(isActive && !isDisplayed && mealPlan.recipes.length > 0) &&
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
                    {showBodyContent()}
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