import './App.scss'
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import AllRecipes from "./pages/allRecipes/allRecipes.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import RecipeView from './pages/recipeView/RecipeView.tsx';
import type {Recipe} from "./models/Recipe.ts";
import RecipeForm from "./pages/recipeForm/RecipeForm.tsx";
import Information from "./pages/information/Information.tsx";
import EditRecipe from "./pages/editRecipe/EditRecipe.tsx";
import FavoriteList from "./pages/favoriteList/FavoriteList.tsx";
import Sources from "./pages/Sources.tsx";
import Footer from "./components/footer/Footer.tsx";
import Header from "./components/header/Header.tsx";
import AskAI from "./pages/askAI/AskAI.tsx";
import MealPlans from "./pages/mealPlans/MealPlans.tsx";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import {useToast} from "./utils/useToast.ts";

function App() {
    const [recipeList, setRecipeList] = useState<Recipe[]>([]);
    const [isFavoured, setIsFavoured] = useState<boolean | undefined>(undefined);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [removed, setRemoved] = useState<boolean>(false);
    const toast = useToast();

    const loadAllRecipes = useCallback(() => {
        axios.get("/api/recipes")
            .then((result) => setRecipeList(result.data))
            .catch(() => toast.error("Fehler beim Laden von Rezepten!"))
    }, [toast]);

    useEffect(() => {
        loadAllRecipes();
    }, [isFavoured, isSaved, removed, loadAllRecipes]);

    return (
        <>
            <Header/>
            <Routes>
                <Route path="/dashboard" element={<Dashboard recipes={recipeList}/>}/>
                <Route path="/" element={<AllRecipes recipes={recipeList}/>}/>
                <Route path="/favorites"
                       element={<FavoriteList recipes={recipeList} onUpdateFavorite={setIsFavoured}/>}
                />
                <Route path="/recipes/new" element={<RecipeForm isEditMode={false} onSave={setIsSaved}/>}/>
                <Route path="/recipes/:id"
                       element={<RecipeView onUpdateFavorite={setIsFavoured} onDelete={setRemoved}/>}
                />
                <Route path="/recipes/:id/edit" element={<EditRecipe onSave={setIsSaved}/>}/>
                <Route path="/info" element={<Information/>}/>
                <Route path="/icon-sources" element={<Sources/>}/>
                <Route path="/ai" element={<AskAI/>}/>
                <Route path="/meal-plans" element={<MealPlans/>}/>
            </Routes>
            <Footer/></>
    )
}

export default App
