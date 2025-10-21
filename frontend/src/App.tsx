import './App.css'
import {useEffect, useState} from "react";
import type {Recipe} from "./models/Recipe.ts";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import AllRecipes from "./pages/allRecipes/allRecipes.tsx";
import Navbar from "./components/Navbar.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";

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
      </Routes>
    </>
  )
}

export default App
