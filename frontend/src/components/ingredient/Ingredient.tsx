import type {Ingredient} from "../../models/Ingredient.ts";
import {type ChangeEvent, useEffect, useState} from "react";
import {units} from "../const.ts";
import "./Ingredient.css"

type IngredientProps = {
    editableIngredient?: Ingredient | undefined;
    setIngredient: (ingredient: Ingredient) => void
}

export default function Ingredient(props: IngredientProps) {
    console.log("++++", props.editableIngredient)

    const empty: Ingredient = {
        name: "", quantity: 0, unit: "g", additionalInfo: ""
    };

    const [name, setName] = useState<string>("");
    const [editable, setEditable] = useState<Ingredient>(props.editableIngredient ?? empty);
    const [quantity, setQuantity] = useState<number>(0);
    const [unit, setUnit] = useState<string>("g");
    const [additionalInfo, setAdditionalInfo] = useState<string>("");
    // const ingredient: Ingredient = editable ? editable : empty;

    useEffect(() => {
        const editable: Ingredient = props.editableIngredient ?? empty;
        setName(editable.name);
        setQuantity(editable.quantity);
        setUnit(editable.unit);
        setAdditionalInfo(editable.additionalInfo);
    }, [props.editableIngredient]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        event.preventDefault();
        const {name, value} = event.target;

        switch (name) {
            case "name":
                setName(value);
                break
            case "quantity":
                setQuantity(+value);
                break
            case "unit":
                setUnit(value);
                break
            default:
                setAdditionalInfo(value);
        }
    }

    function sendIngredient() {
        const newIngredient: Ingredient = {
            name,
            quantity,
            unit,
            additionalInfo,
        };

        props.setIngredient(newIngredient);

        setName("");
        setQuantity(0);
        setUnit("g");
        setAdditionalInfo("");
        setEditable(empty);
        //props.setIngredient(empty);
    }

    return (
        <>
            <div className="section">
                <div className="more section">
                    <div className="half-width">
                        <h4>Zutat hinzufügen:</h4>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            className={editable ? "full-width edit" : "full-width"}
                            placeholder={"Zutat (z.B. Zwiebel) ..."}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <h4>Zusätzliche Information:</h4>
                        <input
                            type="text"
                            maxLength={100}
                            className={editable ? "info-width edit" : "info-width"}
                            name="additionalInfo"
                            value={additionalInfo}
                            placeholder={"z.B. fein gehackt..."}
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
                            value={quantity}
                            className="full-width"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="less">
                        <h4>Einheit:</h4>
                        <select
                            name={"unit"}
                            className="full-width"
                            value={unit}
                            onChange={handleChange}
                        >
                            {
                                units.map((unit) =>
                                    <option key={unit.short} value={unit.short}>
                                        {unit.short}
                                    </option>)
                            }
                        </select>
                    </div>
                    <button
                        type={"button"}
                        className="add-button"
                        aria-label="Zutat hinzufügen"
                        disabled={name.trim().length < 2}
                        onClick={sendIngredient}
                    >+</button>
                </div>
            </div>
        </>
    )
}