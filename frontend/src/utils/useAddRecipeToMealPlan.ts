import axios from "axios";
import {useState} from "react";
import {localStorageKey} from "../const.ts";
import type {Recipe} from "../models/Recipe.ts";

export function useAddRecipeToMealPlan() {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [activeMealPlanId, setActiveMealPlanId] = useState<string | null>(localStorage.getItem(localStorageKey));
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [temporaryRecipe, setTemporaryRecipe] = useState<Recipe | null>(null);

    const addToMealPlan = async (recipe: Recipe): Promise<boolean> => {
        const currentPlanId = activeMealPlanId || localStorage.getItem(localStorageKey);
        const isRecipeInCurrentPlan = localStorage.getItem(recipe.id) === currentPlanId;

        if (!currentPlanId) {
            setTemporaryRecipe(recipe);
            setDialogVisible(true);
            return false;
        }

        if (isRecipeInCurrentPlan) {
            alert("Das Rezept ist bereits im aktiven Speiseplan!");
            return false;
        }

        setIsProcessing(true);

        try {
            const result = await axios.post(`/api/meal-plan/${currentPlanId}`, recipe);
            const isSuccess = !!result.data.recipes.some((r: Recipe) => r.id === recipe.id);

            if (isSuccess) {
                localStorage.setItem(recipe.id, currentPlanId);
                alert(`"${recipe.name}" wurde zum aktiven Speiseplan hinzugefügt!`);
            }

            return isSuccess;
        } catch (error) {
            alert("Fehler beim Hinzufügen des Rezepts zum Speiseplan: " + error);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const createNewMealPlan = async (name: string) => {
        setIsProcessing(true);

        try {
            const result = await axios.post("/api/meal-plan", name, {
                headers: { "Content-Type": "text/plain" },
            });

            const newPlanId: string = result.data.id;
            localStorage.setItem(localStorageKey, newPlanId);
            setActiveMealPlanId(newPlanId);
            setDialogVisible(false);

            if (temporaryRecipe) {
                await addToMealPlan(temporaryRecipe);
                setTemporaryRecipe(null);
            }
        } catch (error) {
            alert("Fehler beim Erstellen des Speiseplans: " + error);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        addToMealPlan,
        dialogVisible,
        setDialogVisible,
        createNewMealPlan,
        activeMealPlanId,
        isProcessing,
    };
}
