import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { Ingredient } from "../../models/Ingredient.ts";
import { units } from "../const.ts";
import "./Ingredient.css";

type IngredientProps = {
    editableIngredient?: Ingredient;
    setIngredient: (ingredient: Ingredient) => void;
};

export default function Ingredient(props: IngredientProps) {
    const { editableIngredient, setIngredient } = props;
    const empty: Ingredient = { name: "", quantity: 0, unit: "g", additionalInfo: "" };

    const [ingredient, setIngredientState] = useState<Ingredient>(editableIngredient ?? empty);
    const [isEditable, setIsEditable] = useState<boolean>(!!editableIngredient);

    useEffect(() => {
        if (editableIngredient) {
            setIngredientState(editableIngredient);
            setIsEditable(true);
        } else {
            setIngredientState(empty);
            setIsEditable(false);
        }
    }, [editableIngredient]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setIngredientState(prev => ({
            ...prev,
            [name]: name === "quantity" ? +value : value,
        }));
    };

    const handleSave = () => {
        const newIngredient: Ingredient = ingredient;
        setIngredient(newIngredient);
        setIngredientState(empty);
        setIsEditable(false);
    };

    const handleCancel = () => {
        setIngredientState(empty);
        setIsEditable(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement> ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <div className="section" onKeyDown={handleKeyDown}>
            <div className="more section">
                <div className="half-width">
                    <h4>Zutat hinzufügen:</h4>
                    <input
                        type="text"
                        name="name"
                        value={ingredient.name}
                        className={isEditable ? "full-width edit" : "full-width"}
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
                        className={isEditable ? "info-width edit" : "info-width"}
                        placeholder="z.B. fein gehackt..."
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="less display-flex">
                <div className="less">
                    <h4>Menge:</h4>
                    <input
                        type="number"
                        name="quantity"
                        value={ingredient.quantity}
                        className="full-width"
                        onChange={handleChange}
                    />
                </div>

                <div className="less">
                    <h4>Einheit:</h4>
                    <select
                        name="unit"
                        className="full-width"
                        value={ingredient.unit}
                        onChange={handleChange}
                    >
                        {units.map(unit => (
                            <option key={unit.short} value={unit.short}>
                                {unit.short}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    className="add-button"
                    aria-label="Zutat hinzufügen"
                    disabled={ingredient.name.trim().length < 2}
                    onClick={handleSave}
                >
                    +
                </button>
            </div>
        </div>
    );
}
