import './App.css'
import {useEffect, useState} from "react";
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

function App() {

  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [removed, setRemoved] = useState<boolean>(false);

  useEffect(() => {
    loadAllRecipes();
  }, [isUpdated, isSaved, removed]);

  function loadAllRecipes() {
    axios.get("/api/recipes")
        .then((result) => setRecipeList(result.data))
        .catch(() => alert("No data found!"));
  }

  return (
    <>
      <Header/>
      <Routes>
        <Route path={"/"} element={<Dashboard recipes={recipeList}/>}/>
        <Route path={"/recipes"} element={<AllRecipes recipes={recipeList}/>}/>
        <Route path={"/recipes/favorites"} element={<FavoriteList recipes={recipeList} onUpdateFavorite={setIsUpdated} />}/>
        <Route path={"/recipes/new"} element={<RecipeForm isEditMode={false} onSave={setIsSaved}/>}/>
        <Route path={"/recipes/:id"}
               element={<RecipeView onUpdateFavorite={setIsUpdated} onDelete={setRemoved}/>}/>
        <Route path={"/recipes/:id/edit"} element={<EditRecipe onSave={setIsSaved}/>}/>
        <Route path={"/info"} element={<Information/>}/>
        <Route path={"/icon-sources"} element={<Sources/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
