import type {Recipe} from "../../models/Recipe.ts";
import {useParams} from "react-router-dom";
import noImage from "../../../public/noRecipeImage.png";
import noFavorite from "../../../public/heart.png";
import favorite from "../../../public/red-heart.png";
import "./FullRecipe.scss";
import {useState} from "react";
import axios from "axios";

type RecipeFullCardProps = {
    recipes: Recipe[]
}

export default function FullRecipe(props: RecipeFullCardProps) {
    const params = useParams();
    const recipe: Recipe | undefined = props.recipes.find(r => r.id === params.id);
    const [isFavorite, setIsFavorite] = useState<boolean>(recipe?.favorite ?? false);

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
            console.log(r.data);
        })
            .catch(e => console.log(e));
    }

    return (
        <>
            <div className="container">
                <div className="display-flex">
                    <div className="info">
                        <h2>{recipe.name}</h2>
                        <p>Zubereitungszeit: {recipe.speed}</p>

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
                                    className="heart"
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
                            >
                                <img
                                    width={30}
                                    height={30}
                                    src="/public/edit.png"
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
                                    src="/public/add.png"
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