import '../Styles/Liked.css';
import {Await, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import Searchbar from '../Components/Searchbar';
import {
    searchURL,
    allCategoriesURL, 
    allAreasURL, 
    allIngredientsURL,
    mealByIdURL
} from '../utils/APIRoutes.js';
import axios from "axios";
import  {useNavigate} from 'react-router-dom';

import emptyHeart from '../images/icons/heart.png';
import heart from '../images/icons/heart-red.png'


export default function Liked(){
    const navigate = useNavigate();
    
    const [storedMeals, setStoredMeals] = useState(JSON.parse(localStorage.getItem("storedMeals"))?JSON.parse(localStorage.getItem("storedMeals")):{}); 
    const isLiked = (id)=> {
        if(!storedMeals) return false;   
        return (id in storedMeals) && storedMeals[id].liked
    }
    const getHeart = (id)=>{
        if(isLiked(id)){
            return heart;
        }else{
            return emptyHeart;
        }
    }
    const isSaved = (id)=> {    
        return storedMeals && storedMeals[id].saved
    }
    const changeLikeState = (id)=> {
        let newMeals = storedMeals;
        if(newMeals){
            if(newMeals[id]){
                newMeals[id].liked = !newMeals[id].liked; 
            }else{
                newMeals[id] = {
                    liked:true,
                    saved:false
                };
            }
            console.log("changed liked to ", newMeals[id].liked)
        }
        setStoredMeals(newMeals);
        rerenderAndSave();
    }
    const changeSavedState = (id)=> {
        let newMeals = storedMeals;
        if(newMeals){
            if(newMeals[id]){
                newMeals[id].saved = !newMeals[id].saved; 
            }else{
                newMeals[id] = {
                    liked:false,
                    saved:true
                };
            }
            console.log("changed saved to ", newMeals[id].saved)
        }
        setStoredMeals(newMeals);
        rerenderAndSave();
    }

    const saveLikedAndSavedItems = ()=> {
        localStorage.setItem("storedMeals", JSON.stringify(storedMeals));
    }
    const [likedMeals, setLikedMeals] = useState(null)
    useEffect(() => {
        const fetchLikedMeals = async ()=> {
            let meals = {}
            for(let id in storedMeals){
                if(storedMeals[id].liked){
                    let result = await axios.get(mealByIdURL+id);
                    meals[id] = result.data.meals[0];
                }
            }
            setLikedMeals(meals);
            setLikedMealsRendered(renderLikedMeals());
        }
        fetchLikedMeals();

    },[])
    useEffect(() => {setLikedMealsRendered(renderLikedMeals());}, [likedMeals])
    console.log(likedMeals);
    const [likedMealsRendered, setLikedMealsRendered] = useState("");
    const mealRedirect = (meal)=> {
        navigate('/meals/'+meal.idMeal, { state: { meal: meal } });
    }
    const rerenderAndSave = () => {
        setLikedMealsRendered(renderLikedMeals());
        console.log("rerendring..")
        saveLikedAndSavedItems();
        console.log("stored state")
    }
    const renderLikedMeals = ()=> {
        if(likedMeals){
            let likedMealsList = Object.keys(likedMeals).map(key=>likedMeals[key]);
            if(Object.keys(likedMealsList).length === 0){
                return <div>
                    <h1 style={{textAlign: 'center', color: 'white'}}>You never Liked A meal</h1>
                </div>
            }
            return likedMealsList.map((meal)=>{
                return <div className="liked-meal">
                    <div className="search-result-thumbnail" >
                        <img src={meal.strMealThumb} onClick={()=>{mealRedirect(meal)}} width="300" alt={meal.strMealThumb}/>
                    </div>
                    <div className="search-result-description">
                        <div className="search-result-category">
                            <div className="category-tag">
                                {meal.strCategory}
                            </div>
                            <div className="area-tag">
                                {meal.strArea}
                            </div>
                            <div className="reactions">
                                <div className="heart-rect">            
                                    <img src={heart} height="25"
                                        onClick={(e)=>{
                                            // changeLikeState(meal.idMeal)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="search-result-meal-title" onClick={()=>{mealRedirect(meal)}}>
                            <h3>{meal.strMeal}</h3>
                        </div>
                        <div className="search-result-meal-description">
                            {meal.strInstructions}
                            <div className="continue-reading" onClick={()=>{mealRedirect(meal)}}>
                                <u>..Read More</u>
                            </div>
                        </div>
                    </div>
                </div>
            });
        }else{
            return <div>
                <h1 style={{textAlign: 'center', color: 'white'}}>You never Liked A meal</h1>
            </div>
        }
    }
    
    return <>
        <h1 style={{textAlign: 'center', color: 'white'}}>Your Liked Meals</h1>
        <div className="liked-meals">
            {likedMealsRendered}
        </div>
    </>
}