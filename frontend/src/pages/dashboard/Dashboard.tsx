import type {Recipe} from "../../models/Recipe.ts";
import RecipesCounter from "../../components/counter/RecipesCounter.tsx";
import "./Dashboard.css";
import {useState} from "react";

type DashboardProps = {
    recipes: Recipe[];
}

export default function Dashboard(props: DashboardProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const href = (recipeId: string) => `/recipes/${recipeId}`;

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
                    <h4>{title}</h4>
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

    const salats = filterByCategory("SALAD");
    const soups = filterByCategory("SOUP");
    const mainCourses = filterByCategory("MAIN_COURSE");
    const appetizers = filterByCategory("APPETIZER");
    const bakedGoods = filterByCategory("BAKED_GOODS");
    const breakfasts = filterByCategory("BREAKFAST");
    const desserts = filterByCategory("DESSERT");
    return (
        <>
            <p className="page-title">Rezeptenanzahl in den beliebten Kategorien</p>

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
                    <RecipesCounter amount={breakfasts.length} title="Frühstücke" imageSrc="breakfast.png"
                                    onClick={() => openSectionFromCounter("breakfasts")}/>
                    <RecipesCounter amount={bakedGoods.length} title="Backwaren" imageSrc="/backerei.png"
                                    width={70} onClick={() => openSectionFromCounter("bakedGoods")}/>
                    <RecipesCounter amount={desserts.length} title="Desserts" imageSrc="/eis.png"
                                    onClick={() => openSectionFromCounter("desserts")}/>
                </div>

                <div className="accordion">
                    <h3>Mehr Kategorien:</h3>
                    {showRecipesOfCategory("salats", "Salate", salats)}
                    {showRecipesOfCategory("mainCourses", "Hauptgerichte", mainCourses)}
                    {showRecipesOfCategory("soups", "Suppen", soups)}
                    {showRecipesOfCategory("appetizers", "Vorspeisen", appetizers)}
                    {showRecipesOfCategory("breakfasts", "Frühstück", breakfasts)}
                    {showRecipesOfCategory("bakedGoods", "Backwaren", bakedGoods)}
                    {showRecipesOfCategory("desserts", "Desserts", desserts)}
                    {showRecipesOfCategory("sideDishes", "Beilagen", filterByCategory("SIDE_DISHES"))}
                    {showRecipesOfCategory("grill", "Grillgerichte", filterByCategory("GRILL"))}
                    {showRecipesOfCategory("pasta", "Pasta", filterByCategory("PASTA"))}
                    {showRecipesOfCategory("sauce", "Soße", filterByCategory("SAUCE"))}
                    {showRecipesOfCategory("kids", "Kindergerichte", filterByCategory("KIDS"))}
                    {showRecipesOfCategory("preserve", "Einmachen", filterByCategory("PRESERVE"))}
                    {showRecipesOfCategory("vegetarians", "Vegetarische Gerichte", filterByCategory("VEGETARIAN"))}
                    {showRecipesOfCategory("vegans", "Vegane Gerichte", filterByCategory("VEGAN"))}
                    {showRecipesOfCategory("drinks", "Getränke", filterByCategory("DRINK"))}
                    {showRecipesOfCategory("others", "Sonstiges", filterByCategory("OTHER"))}
                </div>
            </div>
        </>
    );
}