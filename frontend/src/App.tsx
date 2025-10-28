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

function App() {

  const [recipeList, setRecipeList] = useState<Recipe[]>([]);

  useEffect(() => {
    loadAllRecipes();
  }, []);

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
        <Route path={"/recipes/new"} element={<RecipeForm/>}/>
        <Route path={"/recipes/:id"} element={<RecipeView recipes={recipeList}/>}/>
      </Routes>
    </>
  )
}

export default App
