import type {Recipe} from "../../models/Recipe.ts";
import {useNavigate, useParams} from "react-router-dom";
import "./RecipeView.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";
import {handleImageError} from "../../utils/HandleImageError.ts";
import MealPlanDialog from "../../components/dialog/MealPlanDialog.tsx";
import {Tooltip} from "react-tooltip";
import {useAddRecipeToMealPlan} from "../../utils/useAddRecipeToMealPlan.ts";
import {localStorageKey} from "../../models/LocalStorageConst.ts";
import Spinner from "../../components/spinner/Spinner.tsx";
import {useToast} from "../../utils/useToast.ts";

type RecipeViewProps = {
    onUpdateFavorite: (isUpdated: boolean) => void;
    onDelete: (isDelete: boolean) => void;
}

export default function RecipeView(props: RecipeViewProps) {
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const noFavorite = "/heart.png";
    const favorite = "/red-heart.png";
    const {addToMealPlan, dialogVisible, setDialogVisible, createNewMealPlan} = useAddRecipeToMealPlan();

    const [recipe, setRecipe] = useState<Recipe>();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/recipes/${params.id}`)
            .then((result) => {
                setRecipe(result.data);
                setIsFavorite(result.data.favorite);
            })
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }, [isFavorite, params.id]);

    const recipeId: string = recipe ? recipe.id : "";
    const isRecipeInActiveMealPlan = !!localStorage.getItem(recipeId) &&
        localStorage.getItem(recipeId) === localStorage.getItem(localStorageKey);

    function updateFavoriteState() {
        const newFavorite = !isFavorite;
        setIsFavorite(newFavorite);

        axios.put("/api/recipes/" + recipe?.id + "/favorite?isFavorite=" + newFavorite, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            setIsFavorite(newFavorite);
            props.onUpdateFavorite(true);
        })
            .catch(e => toast.error("Fehler beim Favoriten update! \n" + e))
    }

    function addRecipeToMealPlan() {
        if (!recipe) {
            return;
        }

        addToMealPlan(recipe)
            .finally(() => setIsLoading(false));
    }

    const handleDelete = () => {
        setIsDeleting(true);
        if (!confirm("Möchten Sie das Rezept wirklich löschen?")) {
            setIsDeleting(false);
            return;
        }

        axios.delete(`/api/recipes/${recipe?.id}`)
            .then(() => {
                props.onDelete(true);
                navigate("/");
            })
            .catch(error => toast.error("Fehler beim Löschen des Rezepts: " + error))
            .finally(() => setIsDeleting(false));
    };

    const colorClass = (speed: string | undefined) => {
        switch (speed) {
            case "FAST":
                return "green";
            case "LONG":
                return "red";
            default:
                return "yellow"
        }
    };

    return (
        <>
            <div className="page-title-box">
                <div className="center for-spinner-in-page-title">
                    {isLoading && <Spinner/>}
                </div>
                <div className="page-title">{recipe?.name}</div>
            </div>

            <div className="container">
                {recipe ?
                    <div>
                        <div className="display-flex">
                            <div className="info">
                                <div className="center section">
                                    <div className="with-marker">
                                        <span className="section-title"> Rezeptkategorie </span>
                                        <div className="marker">
                                            <div className="normal">
                                                {recipe?.category}
                                            </div>
                                        </div>
                                    </div>

                                    <img
                                        width={60}
                                        height={60}
                                        src="/kochzeit.png"
                                        alt="kochzeit-Icon"
                                    />

                                    <div className="with-marker">
                                        <span className="section-title"> Zubereitungszeit </span>
                                        <div className="marker">
                                            <div className={colorClass(recipe?.speed)}>
                                                {PreparationSpeed[recipe?.speed as keyof typeof PreparationSpeed]}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <label className="section-title">Zutaten</label>:
                                <ol>
                                    {recipe?.ingredients.map(ingredient =>
                                        <li key={ingredient.name}>
                                            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                            {ingredient.additionalInfo && <span> ({ingredient.additionalInfo}) </span>}
                                        </li>
                                    )}
                                </ol>
                            </div>

                            <div className="display-flex">
                                <div className="actions">
                                    <button
                                        type={"button"}
                                        className="action-button"
                                        onClick={updateFavoriteState}
                                        aria-label={isFavorite ? "Kein Favorit" : "Favorit"}
                                        data-tooltip-id="favorite"
                                        data-tooltip-content={isFavorite ? "Entfavorisieren" : "Favorisieren"}
                                        data-tooltip-place="left-end"
                                    >
                                        <img
                                            width={30}
                                            height={30}
                                            src={isFavorite ? favorite : noFavorite}
                                            alt={isFavorite ? "Favorisiert" : "Nicht favorisiert"}
                                        />
                                    </button>

                                    <button
                                        type={"button"}
                                        className="action-button"
                                        aria-label="Rezept editieren"
                                        data-tooltip-id="edit"
                                        data-tooltip-content="Rezept editieren"
                                        data-tooltip-place="left"
                                        onClick={() => navigate(`/recipes/${recipe?.id}/edit`)}
                                    >
                                        <img
                                            width={30}
                                            height={30}
                                            src="/edit-pen.png"
                                            alt="Edit-Icon"
                                        />
                                    </button>

                                    <button
                                        type={"button"}
                                        className="action-button"
                                        aria-label="Rezept zum Speiseplan hinzufügen"
                                        disabled={isRecipeInActiveMealPlan}
                                        data-tooltip-id="toMenu"
                                        data-tooltip-content={isRecipeInActiveMealPlan ? "Das Rezept ist im aktiven Speiseplan enthalten" : "Rezept zum Speiseplan hinzufügen"}
                                        data-tooltip-place="left"
                                        onClick={addRecipeToMealPlan}
                                    >
                                        <img
                                            width={30}
                                            height={30}
                                            src="/list.png"
                                            alt="AddToList-Icon"
                                        />
                                    </button>

                                    <button
                                        type={"button"}
                                        className="action-button"
                                        aria-label="KI-Anfrage"
                                        data-tooltip-id="askAI"
                                        data-tooltip-content="KI nach einer Zutat fragen"
                                        data-tooltip-place="left"
                                        onClick={() => navigate("/ai")}
                                    >
                                        <img
                                            width={30}
                                            height={30}
                                            src="/chatgpt.png"
                                            alt="Chatgpt-Icon"
                                        />
                                    </button>

                                    <button
                                        type={"button"}
                                        className="action-button"
                                        aria-label="Rezept löschen"
                                        disabled={isDeleting}
                                        data-tooltip-id="remove"
                                        data-tooltip-content="Rezept löschen"
                                        data-tooltip-place="left"
                                        onClick={handleDelete}
                                    >
                                        {isDeleting
                                            ? <div className="center">
                                                <Spinner/>
                                            </div>
                                            : <img
                                                width={26}
                                                height={26}
                                                src="/delete.png"
                                                alt="Menu-Icon"
                                            />
                                        }
                                    </button>
                                </div>

                                <div className={"recipe-image"}>
                                    <img
                                        width={recipe?.image ? 400 : 220}
                                        height={recipe?.image ? 300 : 180}
                                        src={recipe?.image ? recipe?.image : "/noRecipeImage.png"}
                                        onError={handleImageError}
                                        alt="Gerichtbild"/>
                                </div>
                            </div>
                        </div>

                        <label className="section-title"> ZUBEREITUNG</label>:
                        <div className="info-box">
                            {recipe?.description}
                        </div>

                        {recipe?.notes &&
                            <div className="info-box">
                                <label className="section-title">Anmerkungen</label>:
                                <span> {recipe.notes} </span>
                            </div>
                        }

                        {recipe?.linkToSource &&
                            <div className="info-box">
                                <label className="section-title">Link</label>:
                                <a href={recipe.linkToSource} title="Link zum Ressource"> {recipe.linkToSource} </a>
                            </div>
                        }
                    </div>
                    : <>
                        {!isLoading && <h2>Kein Rezept mit ID={params.id} gefunden!</h2>}
                    </>
                }
            </div>

            <Tooltip id="favorite" noArrow className="tooltip"/>
            <Tooltip id="edit" noArrow className="tooltip"/>
            <Tooltip id="toMenu" noArrow className="tooltip"/>
            <Tooltip id="askAI" noArrow className="tooltip"/>
            <Tooltip id="remove" noArrow className="tooltip"/>

            <MealPlanDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onNavigateToMealPlans={() => navigate("/meal-plans")}
                onCreateNewPlan={createNewMealPlan}
            />
        </>
    )
}