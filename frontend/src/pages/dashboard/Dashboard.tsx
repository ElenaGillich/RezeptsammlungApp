import type {Recipe} from "../../models/Recipe.ts";
import RecipesCounter from "../../components/counter/RecipesCounter.tsx";
import "./Dashboard.css";
import {useState} from "react";
import PageTitle from "../../components/pageTitle/PageTitle.tsx";
import {DishCategory} from "../../models/DishCategory.ts";

type DashboardProps = {
    recipes: Recipe[];
}

export default function Dashboard(props: Readonly<DashboardProps>) {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const href = (recipeId: string) => `/recipes/${recipeId}`;
    const salats = filterByCategory(DishCategory.SALAD);
    const soups = filterByCategory(DishCategory.SOUP);
    const mainCourses = filterByCategory(DishCategory.MAIN_COURSE);
    const appetizers = filterByCategory(DishCategory.APPETIZER);
    const bakedGoods = filterByCategory(DishCategory.BAKED_GOODS);
    const breakfasts = filterByCategory(DishCategory.BREAKFAST);
    const desserts = filterByCategory(DishCategory.DESSERT);

    function filterByCategory(category: string) {
        return props.recipes.filter(recipe => recipe.category === category);
    }

    function toggleSection(id: string) {
        setOpenSection(openSection === id ? null : id);
    }

    function openSectionFromCounter(id: string) {
        setOpenSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }

    function showRecipesOfCategory(id: string, title: string, recipes: Recipe[]) {
        const isOpen = openSection === id;

        if (recipes.length < 1) return;

        return (
            <div key={id} id={id} className="accordion-section">
                <button className="accordion-header" onClick={() => toggleSection(id)}>
                    <h4>{title} ({recipes.length})</h4>
                    <span className="arrow">{isOpen ? "▲" : "▼"}</span>
                </button>
                <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                    {isOpen && recipes.map((r) => (
                        <a key={r.id} href={href(r.id)}>
                            <div className="recipe-item">{r.name}</div>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <PageTitle title="Rezeptenanzahl in den beliebten Kategorien"></PageTitle>

            <div className="container">
                <div className="counters">
                    <RecipesCounter amount={salats.length} title="Salate" imageSrc="/salat.png"
                                    onClick={() => openSectionFromCounter("salats")}/>
                    <RecipesCounter amount={mainCourses.length} title="Hauptgerichte" imageSrc="/main-food.png"
                                    width={60} onClick={() => openSectionFromCounter("mainCourses")}/>
                    <RecipesCounter amount={soups.length} title="Suppen" imageSrc="/suppe.png"
                                    onClick={() => openSectionFromCounter("soups")}/>
                    <RecipesCounter amount={appetizers.length} title="Vorspeisen" imageSrc="/kase.png"
                                    onClick={() => openSectionFromCounter("appetizers")}/>
                    <RecipesCounter amount={breakfasts.length} title="Frühstücke" imageSrc="/breakfast.png"
                                    onClick={() => openSectionFromCounter("breakfasts")}/>
                    <RecipesCounter amount={bakedGoods.length} title="Backwaren" imageSrc="/backerei.png"
                                    width={70} onClick={() => openSectionFromCounter("bakedGoods")}/>
                    <RecipesCounter amount={desserts.length} title="Desserts" imageSrc="/eis.png"
                                    onClick={() => openSectionFromCounter("desserts")}/>
                </div>

                {props.recipes.length > 0 &&
                    <div className="accordion">
                        <h3>Mehr Kategorien:</h3>
                        {showRecipesOfCategory("salats", "Salate", salats)}
                        {showRecipesOfCategory("mainCourses", "Hauptgerichte", mainCourses)}
                        {showRecipesOfCategory("soups", "Suppen", soups)}
                        {showRecipesOfCategory("appetizers", "Vorspeisen", appetizers)}
                        {showRecipesOfCategory("breakfasts", "Frühstück", breakfasts)}
                        {showRecipesOfCategory("bakedGoods", "Backwaren", bakedGoods)}
                        {showRecipesOfCategory("desserts", "Desserts", desserts)}
                        {showRecipesOfCategory("sideDishes", "Beilagen", filterByCategory(DishCategory.SIDE_DISH))}
                        {showRecipesOfCategory("grill", "Grillgerichte", filterByCategory(DishCategory.GRILL))}
                        {showRecipesOfCategory("pasta", "Pasta", filterByCategory(DishCategory.PASTA))}
                        {showRecipesOfCategory("sauce", "Soße", filterByCategory(DishCategory.SAUCE))}
                        {showRecipesOfCategory("kids", "Kindergerichte", filterByCategory(DishCategory.KIDS))}
                        {showRecipesOfCategory("preserve", "Einmachen", filterByCategory(DishCategory.PRESERVE))}
                        {showRecipesOfCategory("vegetarians", "Vegetarische Gerichte",
                            filterByCategory(DishCategory.VEGETARIAN))}
                        {showRecipesOfCategory("vegans", "Vegane Gerichte", filterByCategory(DishCategory.VEGAN))}
                        {showRecipesOfCategory("drinks", "Getränke", filterByCategory(DishCategory.DRINK))}
                        {showRecipesOfCategory("others", "Sonstiges", filterByCategory(DishCategory.OTHER))}
                    </div>
                }
            </div>
        </>
    );
}