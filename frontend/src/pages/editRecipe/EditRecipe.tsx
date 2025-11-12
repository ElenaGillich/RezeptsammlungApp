import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Recipe} from "../../models/Recipe.ts";
import axios from "axios";
import RecipeForm from "../recipeForm/RecipeForm.tsx";
import Spinner from "../../components/spinner/Spinner.tsx";

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

        setLoading(true);
        axios.get(`/api/recipes/${id}`)
            .then((result) => {
                setRecipe(result.data);
            })
            .catch((error) => {
                console.log(error);
                setError("Fehler beim Laden des Rezepts!");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <h2>Rezept wird geladen...</h2>
                <div className="in-center">
                    <Spinner size={36}/>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container">{error}</div>;
    }

    if (!recipe && !loading) {
        return <div className="container"><h2>Kein Rezept mit ID={id} gefunden!</h2></div>;
    }

    return (
        <>
            {!loading && <RecipeForm isEditMode={true} recipe={recipe as Recipe} onSave={props.onSave}/>}
        </>
    );
}