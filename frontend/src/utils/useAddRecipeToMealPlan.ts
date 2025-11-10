import axios from "axios";
import {useState} from "react";
import {localStorageKey} from "../const.ts";
import type {Recipe} from "../models/Recipe.ts";

export function useAddRecipeToMealPlan() {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(localStorage.getItem(localStorageKey));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    function addToMealPlan(recipe: Recipe) {
        const currentPlanId = activeMealPlanId || localStorage.getItem(localStorageKey);
        const isRecipeInCurrentPlan = localStorage.getItem(recipe.id) === currentPlanId;

        if (!currentPlanId) {
            setDialogVisible(true);
            return;
        }

        if (isRecipeInCurrentPlan) {
            alert("Das Rezept is bereits im aktiven Speiseplan!");
            return;
        } else {
            setIsLoading(true);

            axios.post(`/api/meal-plan/${currentPlanId}`, recipe)
                .then((result) => {
                    const isSuccess: boolean = !!result.data.recipes.some((r: Recipe) => r.id === recipe.id);
                    if (isSuccess) {
                        localStorage.setItem(recipe.id, currentPlanId);
                        alert(`"${recipe.name}" wurde zum aktiven Speiseplan hinzugefügt!`);
                    }
                })
                .catch((error) => alert("Fehler beim Hinzufügen des Rezepts zum Speiseplan: " + error))
                .finally(() => setIsLoading(false));
        }
    }

    function createNewMealPlan(name: string) {
        setIsLoading(true);

        axios.post("/api/meal-plan", name, {
            headers: {"Content-Type": "text/plain"}
        })
            .then((result) => {
                const newPlanId: string = result.data.id;

                localStorage.setItem(localStorageKey, newPlanId);
                setActiveMealPlanId(newPlanId);
                setDialogVisible(false);
            })
            .catch((error) => alert("Fehler beim Erstellen des Speiseplans. " + error))
            .finally(() => setIsLoading(false));
    }

    return {
        addToMealPlan,
        dialogVisible,
        setDialogVisible,
        createNewMealPlan,
        activeMealPlanId,
        isLoading,
    };
}
