import type {Recipe} from "../../models/Recipe.ts";
import "./ProductsToBuy.css";

type ProductsToBuyProps = {
    recipes: Recipe[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductsToBuy (props : Readonly<ProductsToBuyProps>) {
    return (
        <>
            {(props.isOpen && props.recipes.length > 0) &&
                <div className="products">
                    <div className="title-with-close">
                        <h3>Erforderliche Zutaten:</h3>
                        <button
                            type="button"
                            className="custom-button"
                            onClick={props.onClose}
                        >x</button>
                    </div>

                    {props.recipes.map((recipe) =>
                        <div key={recipe.id} className="space-top">
                            <h4 className="recipe-title">{recipe.name}</h4>
                            <ul>
                                {recipe.ingredients.map((ing) =>
                                    <li key={ing.name}>{ing.name} - {ing.quantity} {ing.unit}</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            }
        </>
    );
}