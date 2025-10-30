import type {Recipe} from "../../models/Recipe.ts";
import {useNavigate, useParams} from "react-router-dom";
import "./RecipeView.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";

type RecipeViewProps = {
    isFavoriteUpdated: (isUpdated: boolean) => void
}
export default function RecipeView(props: RecipeViewProps) {
    const params = useParams();
    const navigate = useNavigate();
    const noFavorite = "/heart.png";
    const favorite = "/red-heart.png";
    const noImage = "/noRecipeImage.png";

    const [recipe, setRecipe] = useState<Recipe>();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`/api/recipes/${params.id}/favorite`)
            .then((result) => {
                setRecipe(result.data);
                setIsFavorite(result.data.favorite)
            })
            .catch((error) => console.log(error))
    }, [isFavorite, params.id]);

    if (!recipe) {
        return <h2>Kein Rezept mit ID={params.id} gefunden!</h2>;
    }

    function updateFavoriteState() {
        const newFavorite = !isFavorite;
        setIsFavorite(newFavorite);
        axios.put("/api/recipes/" + recipe?.id + "?isFavorite=" + newFavorite, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            setIsFavorite(newFavorite);
            props.isFavoriteUpdated(true);
//TODO: remove log
console.log(r.data);
        })
            .catch(e => alert("Fehler beim Favoriten update! "+e));
    }

    return (
        <>
            <div className="container">
                <div className="display-flex">
                    <div className="info">
                        <h2>{recipe.name}</h2>
                        <p>Zubereitungszeit: {PreparationSpeed[recipe.speed as keyof  typeof PreparationSpeed]}</p>

                        <label className="section-title">Zutaten</label>:
                        <ol>
                            {recipe.ingredients.map(ingredient =>
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
                                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                            >
                                <img
                                    width={30}
                                    height={30}
                                    src="/edit.png"
                                    alt="Edit-Icon"
                                />
                            </button>

                            <button
                                type={"button"}
                                className="action-button"
                                aria-label="Rezept zum Menü hinzufügen"
                            >
                                <img
                                    width={30}
                                    height={30}
                                    src="/add.png"
                                    alt="Menu-Icon"
                                />
                            </button>
                        </div>
                        <div className={"recipe-image"}>
                            <img
                                width={recipe.image ? 400 : 230}
                                height={recipe.image ? 300 : 180}
                                src={recipe.image ? recipe.image : noImage}
                                alt="Gerichtbild"/>
                        </div>
                    </div>
                </div>

                <label className="section-title"> ZUBEREITUNG</label>:
                <div className="info-box">
                    {recipe.description}
                </div>

                {recipe.notes &&
                    <div className="info-box">
                        <label className="section-title">Anmerkungen</label>:
                        <span> {recipe.notes} </span>
                    </div>
                }

                {recipe.linkToSource &&
                    <div className="info-box">
                        <label className="section-title">Link</label>:
                        <a href={recipe.linkToSource} title="Link zum Ressource"> {recipe.linkToSource} </a>
                    </div>
                }
            </div>
        </>
    )
}