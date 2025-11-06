export default function MealPlan() {
    const localStorageData = localStorage.getItem("recipe");
    const nameStartIndex = localStorageData?.indexOf("NAME=");
    const recipeName = localStorageData?.slice(nameStartIndex);
    const hrefValue = "/recipes/"+localStorageData?.substring(3, (nameStartIndex as number-1));

    return(
        <div className="container">
            <h2>Der Speiseplan beinhaltet heute folgende Rezepte:</h2>
            <a href={hrefValue}>{recipeName?.substring(5)}</a>
        </div>
    )
}