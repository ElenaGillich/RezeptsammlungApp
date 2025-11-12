import axios from "axios";
import {useState} from "react";
import {localStorageKey} from "../const.ts";
import type {Recipe} from "../models/Recipe.ts";

export function useAddRecipeToMealPlan() {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(localStorage.getItem(localStorageKey));
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [temporaryRecipe, setTemporaryRecipe] = useState<Recipe | null>(null);

    function addToMealPlan(recipe: Recipe): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const currentPlanId = activeMealPlanId || localStorage.getItem(localStorageKey);
            const isRecipeInCurrentPlan = localStorage.getItem(recipe.id) === currentPlanId;

            if (!currentPlanId) {
                setTemporaryRecipe(recipe);
                setDialogVisible(true);
                return resolve(false);
            }

            if (isRecipeInCurrentPlan) {
                alert("Das Rezept is bereits im aktiven Speiseplan!");
                return resolve(false);
            }

            setIsProcessing(true);

            axios.post(`/api/meal-plan/${currentPlanId}`, recipe)
                .then((result) => {
                    const isSuccess: boolean = !!result.data.recipes.some((r: Recipe) => r.id === recipe.id);
                    if (isSuccess) {
                        localStorage.setItem(recipe.id, currentPlanId);
                        alert(`"${recipe.name}" wurde zum aktiven Speiseplan hinzugefügt!`);
                    }
                    resolve(isSuccess);
                })
                .catch((error) => {
                    alert("Fehler beim Hinzufügen des Rezepts zum Speiseplan: " + error);
                    reject(error);
                })
                .finally(() => setIsProcessing(false));
        });
    }

    function createNewMealPlan(name: string) {
        setIsProcessing(true);

        axios.post("/api/meal-plan", name, {
            headers: {"Content-Type": "text/plain"}
        })
            .then((result) => {
                const newPlanId: string = result.data.id;

                localStorage.setItem(localStorageKey, newPlanId);
                setActiveMealPlanId(newPlanId);
                setDialogVisible(false);
                if (temporaryRecipe) {
                    setIsProcessing(false);
                    addToMealPlan(temporaryRecipe)
                        .finally(() => setTemporaryRecipe(null));
                }
            })
            .catch((error) => alert("Fehler beim Erstellen des Speiseplans. " + error))
            .finally(() => setIsProcessing(false));
    }

    return {
        addToMealPlan,
        dialogVisible,
        setDialogVisible,
        createNewMealPlan,
        activeMealPlanId,
        isProcessing: isProcessing,
    };
}
