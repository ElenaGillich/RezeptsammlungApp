import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { Ingredient } from "../../models/Ingredient.ts";
import { units } from "../../const.ts";
import "./Ingredient.css";

type IngredientProps = {
    editableIngredient?: Ingredient;
    onSetIngredient: (ingredient: Ingredient) => void;
};

export default function Ingredient(props: IngredientProps) {
    const { editableIngredient, onSetIngredient } = props;
    const empty: Ingredient = { name: "", quantity: 0, unit: "g", additionalInfo: "" };

    const [ingredient, setIngredient] = useState<Ingredient>(editableIngredient ?? empty);
    const [isEditable, setIsEditable] = useState<boolean>(!!editableIngredient);

    useEffect(() => {
        if (editableIngredient) {
            setIngredient(editableIngredient);
            setIsEditable(true);
        } else {
            setIngredient(empty);
            setIsEditable(false);
        }
    }, [editableIngredient]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setIngredient(prev => ({
            ...prev,
            [name]: name === "quantity" ? +value : value,
        }));
    };

    const handleSave = () => {
        onSetIngredient(ingredient);
        setIngredient(empty);
        setIsEditable(false);
    };

    const handleCancel = () => {
        setIngredient(empty);
        setIsEditable(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement> ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (ingredient.name) {
                handleSave();
            }
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <>
            <div className="section" role="button" onKeyDown={handleKeyDown}>
                <div className="more section">
                    <div className="half-width">
                        <h4 className={"required"}>Zutat hinzufügen:</h4>
                        <input
                            type="text"
                            name="name"
                            value={ingredient.name}
                            maxLength={50}
                            className={isEditable ? "full-width process" : "full-width"}
                            placeholder="Zutat (z.B. Zwiebel) ..."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <h4>Zusätzliche Information:</h4>
                        <input
                            type="text"
                            name="additionalInfo"
                            value={ingredient.additionalInfo}
                            maxLength={100}
                            className={isEditable ? "info-width process" : "info-width"}
                            placeholder="z.B. fein gehackt..."
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="with-quantity">
                    <div className="quantity">
                        <h4>Menge:</h4>
                        <input
                            type="number"
                            name="quantity"
                            value={ingredient.quantity}
                            className="quantity"
                            max={999}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="more">
                        <h4>Einheit:</h4>
                        <select
                            name="unit"
                            className="full-width"
                            value={ingredient.unit}
                            onChange={handleChange}
                        >
                            {units.map(unit => (
                                <option key={unit.short} value={unit.short}>
                                    {unit.full}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        className="add-button"
                        aria-label="Zutat hinzufügen"
                        disabled={ingredient.name.trim().length < 1}
                        onClick={handleSave}
                    >
                        +
                    </button>
                </div>
            </div>
        </>
    );
}
