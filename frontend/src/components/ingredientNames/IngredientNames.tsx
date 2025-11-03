import {Tooltip} from "react-tooltip";

type IngredientProps = {
    ingredients: string;
    isRecipeCard?: boolean;
}

export default function IngredientNames(props: IngredientProps) {
    return (
        <>
            <div
                className="truncated ingredients"
                data-tooltip-id="ingredients"
                data-tooltip-content={props.ingredients}
                data-tooltip-place="bottom-end"
            >
                {props.isRecipeCard && <span><u>Zutaten</u>:</span>}
                <span className={props.isRecipeCard ? "kursive" : ""}>{props.ingredients}</span>
            </div>

            {props.isRecipeCard && <Tooltip id="ingredients" noArrow className="tooltip"/>}
        </>
    )
}
