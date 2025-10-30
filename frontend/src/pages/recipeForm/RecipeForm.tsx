import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import axios from "axios";
import type {RecipeDto} from "../../models/RecipeDto.ts";
import "./RecipeForm.scss";
import {PreparationSpeed} from "../../models/PreparationSpeed.ts";
import {DishCategory} from "../../models/DishCategory.ts";
import Ingredient from "../../components/ingredient/Ingredient.tsx";
import type {Ingredient as IngredientType} from "../../models/Ingredient.ts";
import {useNavigate} from "react-router-dom";
import type {Recipe} from "../../models/Recipe.ts";
import {emptyRecipeDto} from "../../components/const.ts";

type RecipeFormProps = {
    isEditMode: boolean,
    recipe?: Recipe | null,
    isSaved: (isSaved: boolean) => void
}

export default function RecipeForm(props: Readonly<RecipeFormProps>) {
    const {isEditMode, recipe} = props;
    const navigate = useNavigate();

    const dishCategories = Object.entries(DishCategory);
    const speedValues = Object.entries(PreparationSpeed);

    const [ingredients, setIngredients] = useState<IngredientType[]>([]);
    const [image, setImage] = useState<File | string>();
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [formData, setFormData] = useState<RecipeDto>(emptyRecipeDto);
    const [error, setError] = useState<string>("");
    const [edibleIngredient, setEdibleIngredient] = useState<IngredientType | undefined>(undefined);

    useEffect(() => {
        if (isEditMode && recipe) {
            const recipeDto: RecipeDto = {
                name: recipe.name,
                category: recipe.category,
                image: recipe.image,
                ingredients: recipe.ingredients,
                description: recipe.description,
                speed: recipe.speed,
                notes: recipe.notes,
                opinionOfTheDish: recipe.opinionOfTheDish,
                linkToSource: recipe.linkToSource,
                favorite: recipe.favorite
            };

            setFormData(recipeDto);
            setIngredients(recipe.ingredients ?? []);

            if (recipe.image) {
                setFileName(recipe.image);
                setImagePreview(recipe.image);
            }
        }

    }, [isEditMode, recipe]);

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file: File | undefined = event.target.files?.[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024; // 2 MB

        const errorMessage: string = file.size > maxSize
            ? "Datei ist zu groß! Maximale Größe — 2 МB."
            : "Erlaubt sind nur JPG/JPEG und PNG.";

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type) || file.size > maxSize) {
            setError(errorMessage);
            setFileName("");
            setImage(undefined);
            setImagePreview("");
            event.target.value = "";
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));

        setError("");
        setFileName(file.name);
    }

    function updateIngredient(ingredient: IngredientType, isEdit: boolean = false) {
        if (isEdit) {
            setEdibleIngredient({...ingredient});
        } else {
            const updated = ingredients.filter(value => value.name !== ingredient.name);

            setIngredients(updated);
            setFormData((prev: RecipeDto): RecipeDto => ({...prev, ingredients: updated}));
            setEdibleIngredient(undefined);
        }
    }

    const handleRemoveImage = () => {
        setFormData((prev: RecipeDto): RecipeDto => ({...prev, ["image"]: ""}));
        setFileName("");
        setImagePreview("");
        setError("");
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev: RecipeDto): RecipeDto => ({...prev, [name]: value}));
    };

    const handleIngredients = (newIngredient: IngredientType) => {
        const updated = edibleIngredient
            ? ingredients.map(ingredient =>
                ingredient.name === edibleIngredient.name ? newIngredient : ingredient
            )
            : [...ingredients, newIngredient];

        setIngredients(updated);
        setFormData((prevForm) => ({...prevForm, ingredients: updated}));

        if (edibleIngredient) {
            setEdibleIngredient(undefined)
        }
    };

    async function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data: FormData = new FormData();
        data.append("data", new Blob([JSON.stringify(formData)], {'type': "application/json"}));

        if (image) {
            data.append("file", image);
        }

        try {
            if (isEditMode && recipe?.id) {
                await axios.put(`/api/recipes/${recipe.id}/update`, data);
            } else {
                await axios.post('/api/recipes', data);
            }

            props.isSaved(true);

            if (isEditMode) {
                window.history.back();
            } else {
                navigate("/recipes");
            }
        } catch (e) {
            alert("Fehler beim Speichern! " + e);
        }
    }

    return (
        <>
            <form onSubmit={submitForm}>
                <div className="display-flex">
                    <div>
                        <h2>{isEditMode ? "Rezept bearbeiten" : "Neues Rezept"}</h2>
                        {!(formData.name && formData.category && formData.speed && formData.ingredients?.length > 0) &&
                            <span className="error">* Bereiche mit Sternchen sind Pflichtfelder!</span>
                        }
                    </div>
                    <button
                        className="custom-button"
                        disabled={!(formData.name && formData.category && formData.speed && formData.ingredients?.length > 0)}
                    >
                        Speichern
                    </button>
                </div>

                <div className="container">
                    <div className="display-flex">
                        <div className="new-info">
                            <h4 className={"required"}>Rezeptname</h4>
                            <input
                                type={"text"}
                                name={"name"}
                                required
                                className="recipe-name-input"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <div className="selections">
                                <div className={"selection"}>
                                    <h4 className={"required"}>Kategorie</h4>
                                    <select
                                        name={"category"}
                                        required
                                        className={formData.category === "" ? "full-width placeholder" : "full-width"}
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden> Kategorie wählen...</option>
                                        {dishCategories.map(([key, label]) =>
                                            <option key={key} value={key}>{label}</option>)
                                        }
                                    </select>
                                </div>

                                <div className={"selection"}>
                                    <h4 className={"required"}>Zubereitungszeit</h4>
                                    <select
                                        name={"speed"}
                                        required
                                        className={formData.speed === "" ? "full-width placeholder" : "full-width"}
                                        value={formData.speed}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden> Zubereitungszeit wählen...</option>
                                        {speedValues.map(([key, label]) =>
                                            <option key={key} value={key}>{label}</option>)
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="upload">
                                <h4>Rezeptbild</h4>
                                <input
                                    type='file' name={"image"}
                                    accept={"image/jpeg, image/jpg, image/png"}
                                    onChange={onFileChange}
                                />
                                {fileName && fileName.length > 25
                                    ? fileName.substring(0, 10).concat(" ... ")
                                        .concat(fileName.substring(fileName.length - 10, fileName.length))
                                    : fileName
                                }
                                {error && <span className="error">{error}</span>}
                                {imagePreview &&
                                    <button
                                        type={"button"}
                                        className="icon-button"
                                        onClick={handleRemoveImage}
                                    >
                                        <img
                                            width={26}
                                            height={26}
                                            className="delete"
                                            src="/delete.png"
                                            alt="Delete-Icon"
                                        />
                                    </button>
                                }
                            </div>
                        </div>

                        <div className={"recipe-image"}>
                            <img
                                width={imagePreview ? 400 : 230}
                                height={imagePreview ? 300 : 180}
                                src={imagePreview ? imagePreview : "/noRecipeImage.png"}
                                alt="Rezeptbild"/>
                        </div>
                    </div>
                    <div className="ingredients">
                        <Ingredient
                            editableIngredient={edibleIngredient}
                            setIngredient={handleIngredients}
                        />

                        <h4 className={"required"}>Zutatenliste</h4>
                        <div className={ingredients.length < 1 ? "ingredients-list empty" : "ingredients-list"}>
                            {ingredients.length < 1 && <p className="empty">Es wurde noch keine Zutat hinzugefügt!</p>}

                            <ul className="list">
                                {ingredients.map((ing, i) => (
                                    <li key={i}>
                                        <span className="list-item">
                                            {ing.name} {ing.additionalInfo && `(${ing.additionalInfo})`}
                                            {ing.quantity > 0 && ` - ${ing.quantity} ${ing.unit}`}
                                        </span>

                                        <button
                                            type={"button"}
                                            className="icon-button"
                                            onClick={() => updateIngredient(ing, true)}
                                        >
                                            <img
                                                width={26}
                                                height={26}
                                                src="/edit-pen.png"
                                                alt="Edit-Icon"
                                            />
                                        </button>

                                        <button
                                            type={"button"}
                                            className="icon-button"
                                            onClick={() => updateIngredient(ing)}
                                        >
                                            <img
                                                width={26}
                                                height={26}
                                                src="/delete.png"
                                                alt="Delete-Icon"
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className="section">
                        <div className="more">
                            <h4>Zubereitung</h4>
                            <textarea
                                rows={5}
                                className="full-width"
                                name={"description"}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="less">
                            <h4>Anmerkungen</h4>
                            <textarea
                                rows={5}
                                maxLength={200}
                                name={"notes"}
                                className="full-width"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="section">
                        <div className="full-width">
                            <h4>Meinung zum Rezept</h4>
                            <textarea
                                maxLength={200}
                                name={"opinionOfTheDish"}
                                className="full-width"
                                value={formData.opinionOfTheDish}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="section">
                        <div className="full-width">
                            <h4>Link zum Rezeptressource (z.B. YouTube-Video)</h4>
                            <textarea
                                name={"linkToSource"}
                                className="full-width"
                                value={formData.linkToSource}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="full-width">
                    <button
                        className="custom-button"
                        disabled={!(formData.name && formData.category && formData.speed && formData.ingredients?.length > 0)}
                    >
                        Speichern
                    </button>
                </div>
            </form>
        </>
    );
}