import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import AllRecipes from "./pages/allRecipes/allRecipes.tsx";
import Navbar from "./components/Navbar.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import RecipeView from './pages/recipeView/RecipeView.tsx';
import type {Recipe} from "./models/Recipe.ts";
import RecipeForm from "./pages/recipeForm/RecipeForm.tsx";
import Information from "./pages/information/Information.tsx";
import EditRecipe from "./pages/editRecipe/EditRecipe.tsx";

function App() {

  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    loadAllRecipes();
  }, [isUpdated, isSaved]);

  function loadAllRecipes() {
    axios.get("/api/recipes")
        .then((result) => setRecipeList(result.data))
        .catch(() => console.log("No data found!"));
  }

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path={"/"} element={<Dashboard/>}/>
        <Route path={"/recipes"} element={<AllRecipes recipes={recipeList}/>}/>
        <Route path={"/recipes/new"} element={<RecipeForm isEditMode={false} isSaved={setIsSaved}/>}/>
        <Route path={"/recipes/:id"} element={<RecipeView isFavoriteUpdated={setIsUpdated}/>}/>
        <Route path={"/recipes/:id/edit"} element={<EditRecipe isSaved={setIsSaved}/>}/>
        <Route path={"/info"} element={<Information/>}/>
      </Routes>
    </>
  )
}

export default App
