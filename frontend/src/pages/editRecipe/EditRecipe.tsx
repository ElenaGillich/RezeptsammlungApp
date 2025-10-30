import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Recipe} from "../../models/Recipe.ts";
import axios from "axios";
import RecipeForm from "../recipeForm/RecipeForm.tsx";

type EditRecipeProps = {
    onSave: (isSaved: boolean) => void
}

export default  function EditRecipe(props: Readonly<EditRecipeProps>) {
    const params = useParams();
    const id = params.id;

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`/api/recipes/${id}`)
            .then((result) => {
                setRecipe(result.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError("Fehler beim Laden des Rezepts!");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <h2>Rezept wird geladen...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!recipe) {
        return <h2>Kein Rezept mit ID={id} gefunden!</h2>;
    }

    return (
        <>
            {<RecipeForm isEditMode={true} recipe={recipe as Recipe} isSaved={props.onSave}/>}
        </>
    );
}