import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Recipe} from "../../models/Recipe.ts";
import axios from "axios";
import RecipeForm from "../recipeForm/RecipeForm.tsx";

type EditRecipeProps = {
    onSave: (isSaved: boolean) => void
}

export default function EditRecipe(props: Readonly<EditRecipeProps>) {
    const params = useParams();
    const id = params.id;

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`/api/recipes/${id}`)
            .then((result) => setRecipe(result.data))
            .catch((error) => {
                console.log(error);
                setError("Fehler beim Laden des Rezepts!");
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <>
            <RecipeForm
                isEditMode={true}
                errorInEditMode={error}
                recipe={recipe as Recipe}
                onSave={props.onSave}
                recipeLoading={loading}
            />
        </>
    )
}
