import type {Recipe} from "../../models/Recipe.ts";
import {useNavigate, useParams} from "react-router-dom";
import "./RecipeView.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";
import MealPlanDialog from "../../components/dialog/MealPlanDialog.tsx";
import {Tooltip} from "react-tooltip";
import {useAddRecipeToMealPlan} from "../../utils/useAddRecipeToMealPlan.ts";
import {localStorageKey} from "../../models/LocalStorageConst.ts";
import RecipeActions from "./RecipeActions.tsx";
import PageTitle from "../../components/pageTitle/PageTitle.tsx";

type RecipeViewProps = {
    onUpdateFavorite: (isFavoured: boolean) => void;
    onDelete: (isDelete: boolean) => void;
}

export default function RecipeView(props: RecipeViewProps) {
    const params = useParams();
    const navigate = useNavigate();
    const {addToMealPlan, dialogVisible, setDialogVisible, createNewMealPlan} = useAddRecipeToMealPlan();

    const [recipe, setRecipe] = useState<Recipe>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/recipes/${params.id}`)
            .then((result) => setRecipe(result.data))
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }, [params.id]);

    const recipeId: string = recipe ? recipe.id : "";
    const isRecipeInActiveMealPlan = !!localStorage.getItem(recipeId) &&
        localStorage.getItem(recipeId) === localStorage.getItem(localStorageKey);

    function addRecipeToMealPlan() {
        if (!recipe) {
            return;
        }

        addToMealPlan(recipe)
            .finally(() => setIsLoading(false));
    }

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
            <PageTitle title={recipe?.name} hasSpinner={isLoading}/>

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

                            <RecipeActions
                                recipe={recipe}
                                isRecipeInActiveMealPlan={isRecipeInActiveMealPlan}
                                onDelete={(value: boolean) => props.onDelete(value)}
                                onUpdateFavorite={(value: boolean) => props.onUpdateFavorite(value)}
                                onAddToMealPlan={() => addRecipeToMealPlan()}
                            />
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