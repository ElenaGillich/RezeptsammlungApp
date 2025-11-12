import type {MealPlan} from "../../models/MealPlan.ts";
import "./MealPlanCard.css";
import {useState} from "react";
import {DishCategory} from "../../models/DishCategory.ts";
import axios from "axios";
import {Tooltip} from "react-tooltip";

type MealPlanCardProps = {
    mealPlan: MealPlan;
    isActive: boolean;
    isProductListVisible: boolean;
    onRemoveMealPlan: (planId: string) => void;
    onRemoveRecipeFromMealPlan: (mealPlan: MealPlan) => void;
    onShowProducts: () => void;
};

export default function MealPlanCard(props: Readonly<MealPlanCardProps>) {
    const isActiveMealPlan = props.isActive;
    const [mealPlan, setMealPlan] = useState<MealPlan>(props.mealPlan);

    function removeRecipe(recipeId: string) {
        axios.delete(`/api/meal-plan/${mealPlan.id}/recipe/${recipeId}`)
            .then((result) => {
                setMealPlan(result.data);
                localStorage.removeItem(recipeId);
                props.onRemoveRecipeFromMealPlan(result.data);
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

                    {showRecipesForCategory(category)}
                </div>
            )
        );
    }

    function showRecipesForCategory(category: string) {
        return (
            <ul className="list">
                {mealPlan.recipes.map(recipe => recipe.category === category ?
                    <li className="list-item" key={recipe.id}>
                        <div className="left">
                            <a href={`/recipes/${recipe.id}`}>{recipe.name}</a>
                        </div>
                        <div className="right">
                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => removeRecipe(recipe.id)}
                            >x
                            </button>
                        </div>
                    </li>
                    : ""
                )}
            </ul>
        )
    }

    function showIconButtons() {
        return (
            <div className="buttons">
                {(isActiveMealPlan && !props.isProductListVisible && mealPlan.recipes.length > 0) &&
                    <button
                        type="button"
                        className="action-button"
                        data-tooltip-id="products"
                        data-tooltip-content="Lebensmittelliste anzeigen"
                        data-tooltip-place="top"
                        onClick={() => {
                            props.onShowProducts();
                        }}
                    >
                        <img
                            width={34}
                            height={32}
                            src="/grocery.png"
                            alt="Grocery-Icon"
                        />
                    </button>
                }

                <button
                    type="button"
                    className="action-button"
                    data-tooltip-id="remove"
                    data-tooltip-content="Den Speiseplan löschen"
                    data-tooltip-place="top"
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
        );
    }

    return (
        <div className={`card-box ${isActiveMealPlan ? "active" : ""}`}>
            <div className={`card-header ${isActiveMealPlan ? "header-active" : ""}`}>
                <h4>{mealPlan.name}</h4>

                {showIconButtons()}
            </div>

            <Tooltip id="remove" noArrow className="tooltip"/>
            <Tooltip id="products" noArrow className="tooltip"/>

            <div className="card-body">
                {showBodyContent()}
            </div>
        </div>
    );
}