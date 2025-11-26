import type {Recipe} from "../../models/Recipe.ts";
import {DataTable, type DataTableRowClickEvent} from "primereact/datatable";
import {Column} from "primereact/column";
import {useNavigate} from "react-router-dom";
import type {Ingredient} from "../../models/Ingredient.ts";
import IngredientNames from "../../components/ingredientNames/IngredientNames.tsx";
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import "./FavoriteList.scss"
import {Tooltip} from "react-tooltip";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";
import {useAddRecipeToMealPlan} from "../../utils/useAddRecipeToMealPlan.ts";
import MealPlanDialog from "../../components/dialog/MealPlanDialog.tsx";
import {localStorageKey} from "../../models/LocalStorageConst.ts";
import PageTitle from "../../components/pageTitle/PageTitle.tsx";
import {useToast} from "../../utils/useToast.ts";

type FavoriteListProps = {
    recipes: Recipe[];
    onUpdateFavorite: (isFavorite: boolean) => void;
}

export default function FavoriteList(props: FavoriteListProps) {
    const navigate = useNavigate();
    const toast = useToast();
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [addedInMealPlan, setAddedInMealPlan] = useState<Recipe[]>([]);
    const {addToMealPlan, dialogVisible, setDialogVisible, createNewMealPlan, isProcessing} = useAddRecipeToMealPlan();

    useEffect(() => {
        const favoured = props.recipes.filter((recipe: Recipe) => recipe.favorite) ?? [];
        setFavorites(favoured);
    }, [props.recipes]);

    useEffect(() => {
        const activePlanId = localStorage.getItem(localStorageKey);
        if (!activePlanId) {
            return;
        }

        const storedIds = new Set(Object.keys(localStorage).filter(key => localStorage.getItem(key) === activePlanId));
        const restored = props.recipes.filter((recipe: Recipe) => storedIds.has(recipe.id));
        setAddedInMealPlan(restored);
    }, [props.recipes]);

    const ingredientsTemplate = (recipe: Recipe) => {
        const names: string = recipe.ingredients.map((ingredient: Ingredient) => " " + ingredient.name).toString();
        return <IngredientNames ingredients={names}/>;
    }

    const categoryTemplate = (recipe: Recipe) => (
        <div className="marker">
            <div className="normal">{recipe.category}</div>
        </div>
    );

    const speedTemplate = (recipe: Recipe) => {
        let color = "yellow";

        if (recipe.speed === ("FAST" as PreparationSpeed)) {
            color = "green";
        } else if (recipe.speed === ("LONG" as PreparationSpeed)) {
            color = "red";
        }

        return (
            <div className="marker">
                <div className={color}>
                    {PreparationSpeed[recipe.speed as keyof typeof PreparationSpeed]}
                </div>
            </div>
        )
    };

    const handleUpdateFavoriteSuccess = useCallback((recipe: Recipe) => {
        props.onUpdateFavorite(false);
        setFavorites((prev) => prev.filter((item) => item.id !== recipe.id));
    }, [props]);

    const updateFavoriteState = useCallback((recipe: Recipe) => {
        axios.put(`/api/recipes/${recipe.id}/favorite?isFavorite=false`)
            .then(() => handleUpdateFavoriteSuccess(recipe))
            .catch((e) => toast.error("Fehler beim Entfavorisieren! \n" + e));
    }, [handleUpdateFavoriteSuccess, toast]);

    const onAddRecipeToPlanError = (recipe: Recipe) => {
        setAddedInMealPlan(prev => prev.filter(r => r.id !== recipe.id));
    };

    const addRecipeToMealPlan = useCallback((recipe: Recipe) => {
            const updateList = (prev: Recipe[]) => {
                const alreadyExists = prev.some(r => r.id === recipe.id);
                return alreadyExists ? prev : [...prev, recipe];
            };

            setAddedInMealPlan(updateList);
            addToMealPlan(recipe).catch(onAddRecipeToPlanError);
        },
        [addToMealPlan]
    );

    const actions = useCallback((recipe: Recipe) => {
        const isAlreadyAdded: boolean = !dialogVisible && addedInMealPlan.some((item) => item.id === recipe.id);

        return (
            <div className="display-flex">
                <button
                    type="button"
                    className="icon-button"
                    onClick={() => updateFavoriteState(recipe)}
                    aria-label="Entfavorisieren"
                    data-tooltip-id="noFavorite"
                    data-tooltip-content="Entfavorisieren"
                    data-tooltip-place="bottom-end"
                >
                    <img
                        width={30}
                        height={30}
                        src="/no-favorite.png"
                        alt="Entfavorisieren"
                    />
                </button>

                <button
                    type="button"
                    className={`icon-button ${isAlreadyAdded ? "disabled" : ""}`}
                    onClick={() => !isAlreadyAdded && addRecipeToMealPlan(recipe)}
                    aria-label="Rezept zum Speiseplan hinzufügen"
                    data-tooltip-id="toMenu"
                    data-tooltip-content={
                        isAlreadyAdded
                            ? "Das Rezept ist bereits im aktiven Speiseplan"
                            : "Rezept zum Speiseplan hinzufügen"
                    }
                    data-tooltip-place="bottom-end"
                >
                    <img
                        width={28}
                        height={28}
                        src="/list.png"
                        alt="Add to meal plan"
                    />
                </button>
            </div>
        );
    }, [dialogVisible, addedInMealPlan, updateFavoriteState, addRecipeToMealPlan]);

    function navigateToDetails(event: DataTableRowClickEvent) {
        navigate(`/recipes/${event.data.id}`);
    }

    return (
        <>
            <PageTitle title={`Meine Favoriten (${favorites.length})`}></PageTitle>

            <div className="container">
                {props.recipes.length < 1 && <h2>Keine Favoriten gefunden!</h2>}

                {props.recipes.length > 0 && (
                    <DataTable
                        className="favorites"
                        key={addedInMealPlan.map((r) => r.id).join(",")}
                        onRowClick={navigateToDetails}
                        dataKey="id"
                        value={favorites}
                        removableSort
                        rowClassName={() => "clickable"}
                        resizableColumns
                    >
                        <Column field="name" header="Rezeptname"
                                className="truncate name" sortable/>
                        <Column field="ingredients" header="Zutaten" className="widest"
                                body={ingredientsTemplate}/>
                        <Column field="category" header="Kategorie" className="medium"
                                body={categoryTemplate} sortable/>
                        <Column field="speed" header="Zeitaufwand" className="medium"
                                body={speedTemplate} sortable/>
                        <Column field="favorite" body={actions} className="narrowest"/>
                    </DataTable>
                )}
            </div>

            <Tooltip id="noFavorite" noArrow className="tooltip"/>
            <Tooltip id="toMenu" noArrow className="tooltip"/>

            <MealPlanDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onNavigateToMealPlans={() => navigate("/meal-plans")}
                isCreating={isProcessing}
                onCreateNewPlan={createNewMealPlan}
            />
        </>
    );
}