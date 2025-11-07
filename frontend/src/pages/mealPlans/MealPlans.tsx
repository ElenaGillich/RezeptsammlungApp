import type {MealPlan} from "../../models/MealPlan.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {localStorageKey} from "../../const.ts";
// import type {Recipe} from "../../models/Recipe.ts";
// import {localStorageKey} from "../../const.ts";

// type MealPlansProps = {
//     mealPlanList: MealPlan[];
// } props: MealPlansProps

export default function MealPlans() {
    // const activeMealPlanId = localStorage.getItem(localStorageKey);
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    // const [recipeInMealPlan, setRecipeInMealPlan] = useState<Recipe | null>();

    useEffect(() => {
        loadAllMealPlans();
    }, []);

    function loadAllMealPlans() {
        axios.get("/api/meal-plan/all")
            .then((result) => setMealPlans(result.data))
            .catch(() => alert("Fehler beim Laden der Speisepläne!"));
    }

    function deleteMealPlan(planId: string) {
        if (!confirm("Möchten Sie den Speiseplan wirklich löschen?")) {
            return;
        }

        axios.delete(`/api/meal-plan/${planId}`)
            .then(() => {
                if (mealPlans.length > 1) {
                   const filtered = mealPlans.filter(plan => plan.id !== planId);
                   setMealPlans(filtered);
                } else {
                    setMealPlans([]);
                }

                if (localStorage.getItem(localStorageKey) === planId) {
                    localStorage.removeItem(localStorageKey);
                    alert("Sie haben keine Speisekarte mehr, die aktiv ist.")
                }
            })
            .catch(() => alert("Fehler beim Löschen des Speiseplanes!"));
    }

    return (
        <>
            <h2 className="page-title">Meine Speisepläne</h2>

            <div className="container">
                {mealPlans.length < 1 && <h2>Keine Speisepläne vorhanden!</h2>}

                {mealPlans.length > 0 &&
                    mealPlans.map(plan => (
                        <ul key={plan.id}>
                            <label className="section-title">Planname:</label>
                            <div className="display-flex">
                                <h4>{plan.name}</h4>

                                <button
                                    type={"button"}
                                    className="icon-button"
                                    onClick={() => deleteMealPlan(plan.id)}
                                >
                                    <img
                                        width={26}
                                        height={26}
                                        src="/delete.png"
                                        alt="Delete-Icon"
                                    />
                                </button>

                            </div>
                            {plan.recipes?.length > 0 && plan.recipes.map(r =>
                                <li key={r.id}>
                                    {r.name}<a href={`/recipes/${r.id}`}></a>
                                </li>
                            )}
                        </ul>
                    ))
                }
            </div>
        </>
    )
}