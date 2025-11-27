import Spinner from "../../components/spinner/Spinner.tsx";
import {handleImageError} from "../../utils/HandleImageError.ts";
import {useNavigate} from "react-router-dom";
import type {Recipe} from "../../models/Recipe.ts";
import axios from "axios";
import {useState} from "react";
import {useToast} from "../../utils/useToast.ts";

type RecipeActionsProps = {
    recipe: Recipe;
    isRecipeInActiveMealPlan: boolean;
    onDelete: (isDelete: boolean) => void;
    onUpdateFavorite: (isUpdated: boolean) => void;
    onAddToMealPlan: () => void;
}

export default function RecipeActions(props: Readonly<RecipeActionsProps>) {
    const {recipe, isRecipeInActiveMealPlan} = props;
    const toast = useToast();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState<boolean>(props.recipe.favorite);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [hasImage] = useState<boolean>(recipe.image?.length > 0);

    const favoriteButtonAttributes = isFavorite ?
        {
            ariaLabel: "Favorit",
            dataTooltipContent: "Entfavorisieren",
            src: "/red-heart.png",
            altText: "Favorisiert",
        } : {
            ariaLabel: "Kein Favorit",
            dataTooltipContent: "Favorisieren",
            src: "/heart.png",
            altText: "Nicht favorisiert",
        }

    const imageAttributes = {
        width: hasImage ? 400 : 220,
        height: hasImage ? 300 : 180,
        src:  hasImage ? recipe.image : "/noRecipeImage.png",
    };

    function updateFavoriteState() {
        const newFavorite = !isFavorite;
        setIsFavorite(newFavorite);

        axios.put("/api/recipes/" + recipe?.id + "/favorite?isFavorite=" + newFavorite, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            setIsFavorite(newFavorite);
            props.onUpdateFavorite(newFavorite);
        })
            .catch(e => toast.error("Fehler beim Favoriten update! \n" + e))
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

    return (
        <div className="display-flex">
            <div className="actions">
                <button
                    type={"button"}
                    className="action-button"
                    onClick={() => updateFavoriteState()}
                    aria-label={favoriteButtonAttributes.ariaLabel}
                    data-tooltip-id="favorite"
                    data-tooltip-content={favoriteButtonAttributes.dataTooltipContent}
                    data-tooltip-place="left-end"
                >
                    <img
                        width={30}
                        height={30}
                        src={favoriteButtonAttributes.src}
                        alt={favoriteButtonAttributes.altText}
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
                    data-tooltip-content={isRecipeInActiveMealPlan
                        ? "Das Rezept ist im aktiven Speiseplan enthalten"
                        : "Rezept zum Speiseplan hinzufügen"}
                    data-tooltip-place="left"
                    onClick={props.onAddToMealPlan}
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
                    onClick={() => handleDelete()}
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
                    width={imageAttributes.width}
                    height={imageAttributes.height}
                    src={imageAttributes.src}
                    onError={handleImageError}
                    alt="Gerichtbild"
                />
            </div>
        </div>
    );
}