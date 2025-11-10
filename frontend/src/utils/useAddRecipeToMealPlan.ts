import axios from "axios";
import {useState} from "react";
import {localStorageKey} from "../const.ts";
import type {Recipe} from "../models/Recipe.ts";

export function useAddRecipeToMealPlan() {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(localStorage.getItem(localStorageKey));
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function addToMealPlan(recipe: Recipe) {
        const currentPlanId = activeMealPlanId || localStorage.getItem(localStorageKey);

        if (!currentPlanId) {
            setDialogVisible(true);
            return false;
        }

        setIsLoading(true);

        try {
            const result = await axios.post(`/api/meal-plan/${currentPlanId}`, recipe);
            return !!result.data.recipes.find((r: Recipe) => r.id === recipe.id);
        } catch (error) {
            alert("Fehler beim Hinzufügen des Rezepts zum Speiseplan: " + error);
            return false;
        } finally {
            setIsLoading(false);
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
