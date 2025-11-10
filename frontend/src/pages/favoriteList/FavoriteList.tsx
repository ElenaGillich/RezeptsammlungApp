import type {Recipe} from "../../models/Recipe.ts";
import {DataTable, type DataTableRowClickEvent} from "primereact/datatable";
import {Column} from "primereact/column";
import {useNavigate} from "react-router-dom";
import type {Ingredient} from "../../models/Ingredient.ts";
import IngredientNames from "../../components/ingredientNames/IngredientNames.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import "./FavoriteList.css"
import {Tooltip} from "react-tooltip";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";
import {DishCategory} from "../../models/DishCategory.ts";
import {useAddRecipeToMealPlan} from "../../utils/useAddRecipeToMealPlan.ts";
import CustomDialog from "../../components/dialog/CustomDialog.tsx";

type FavoriteListProps = {
    recipes: Recipe[],
    onUpdateFavorite: (isFavorite: boolean) => void
}

export default function FavoriteList(props: FavoriteListProps) {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const { addToMealPlan, dialogVisible, setDialogVisible, createNewMealPlan } = useAddRecipeToMealPlan();

    useEffect(() => {
        const favoured = props.recipes.filter(r => r.favorite) ?? [];
        setFavorites(favoured);
    }, [props.recipes]);

    const ingredientsTemplate = (recipe: Recipe) => {
        const names: string = recipe.ingredients.map((ingredient: Ingredient) => " " + ingredient.name).toString();
        return <IngredientNames ingredients={names}/>;
    }

    const categoryTemplate = (recipe: Recipe) => {
        return (
            <div className="marker">
                <div className="normal">{DishCategory[recipe.category as keyof typeof DishCategory]}</div>
            </div>
        )
    }

    const speedTemplate = (recipe: Recipe) => {
        return (
            <div className="marker">
                <div
                    className={recipe.speed === "FAST" as PreparationSpeed
                        ? "green" : (recipe.speed == "LONG" as PreparationSpeed
                            ? "red" : "yellow")
                    }
                >
                    {PreparationSpeed[recipe.speed as keyof typeof PreparationSpeed]}
                </div>
            </div>
        )
    }

    function updateFavoriteState(recipe: Recipe) {
        axios.put("/api/recipes/" + recipe?.id + "/favorite?isFavorite=false")
            .then(() => {
                props.onUpdateFavorite(false);
                const filtered = favorites.filter(item => item.id !== recipe.id);
                setFavorites(filtered);
            })
            .catch(e => alert("Fehler beim Entfavorisieren! " + e));
    }

    function addRecipeToMealPlan(recipe: Recipe) {
        addToMealPlan(recipe)
            .then((isAdded: boolean) => {
              if (isAdded) {
                  alert(`"${recipe.name}" wurde zum aktiven Speiseplan hinzugefügt!`);
              }
            })
    }

    const actions = (recipe: Recipe) => {
        return (
            <div className="display-flex">
                <button
                    type={"button"}
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
                    type={"button"}
                    className="icon-button"
                    onClick={() => addRecipeToMealPlan(recipe)}
                    aria-label="Zum Speiseplan hinzufügen"
                    data-tooltip-id="toMenu"
                    data-tooltip-content="Zum Speiseplan hinzufügen"
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
        )
    }

    function navigateToDetails(event: DataTableRowClickEvent) {
        navigate(`/recipes/${event.data.id}`);
    }

    return (
        <>
            <p className="page-title">Meine Favoriten ({favorites.length})</p>
            <div className="container">
                {props.recipes.length < 1 && <h2>Keine Favorite gefunden!</h2>}
                {props.recipes.length > 0 &&
                    <DataTable
                        onRowClick={navigateToDetails}
                        dataKey="id" value={favorites}
                        removableSort
                        rowClassName={() => "clickable"}
                        resizableColumns
                    >
                        <Column field="name" header="Rezeptname"
                                className={"truncate name"} sortable></Column>
                        <Column field="ingredients" header="Zutaten" className="widest"
                                body={ingredientsTemplate}></Column>
                        <Column field="speed" header="Kategorie" className="medium"
                                body={categoryTemplate} sortable></Column>
                        <Column field="speed" header="Zeitaufwand" className="medium"
                                body={speedTemplate} sortable></Column>
                        <Column field="favorite" body={actions} className="narrowest"></Column>
                    </DataTable>
                }
            </div>
            <Tooltip id="noFavorite" noArrow className="tooltip"/>
            <Tooltip id="toMenu" noArrow className="tooltip"/>

            <CustomDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onNavigateToMealPlans={() => navigate("/meal-plans")}
                onCreateNewPlan={createNewMealPlan}
            />
        </>
    )
}