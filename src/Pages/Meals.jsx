import {useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import Searchbar from '../Components/Searchbar';
import {
    searchURL,
} from '../utils/APIRoutes.js';
import axios from "axios";
import  {useNavigate} from 'react-router-dom';

import emptyHeart from '../images/icons/heart.png';
import heart from '../images/icons/heart-red.png'
import '../Styles/Meals.css';
import {appRoute} from '../utils/vars';


const isIn = (element, array)=>{
    for (let i = 0; i < array.length; i++){
        if(array[i] === element) return true;
    }
    return false;
}

export default function Meals(){
    const location = useLocation();
    const navigate = useNavigate();
    // get all the meals
    const [meals, setMeals] = useState(null);
    useEffect(() => {
      const fetchResults = async () => {
        const results = await axios.get(searchURL+""); 
        setMeals(results.data.meals);
      }
      fetchResults();
    }, [])
    // get the saved state
    const [storedMeals, setStoredMeals] = useState(JSON.parse(localStorage.getItem("storedMeals"))?JSON.parse(localStorage.getItem("storedMeals")):{}); 

    const getHeart = (id)=>{
        if(isLiked(id)){
            return heart;
        }else{
            return emptyHeart;
        }
    }
    const isLiked = (id)=> {
        if(!storedMeals) return false;   
        return (id in storedMeals) && storedMeals[id].liked
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
    useEffect(() => {
        rerenderAndSave();
    }, [storedMeals, meals])

    const mealRedirect = (meal)=> {
        navigate(appRoute + '/meals/'+meal.idMeal, { state: { meal: meal } });
    }

    const rerenderAndSave = () => {
        setMealsRendered(renderMeals())
        console.log("rerendring..")
        saveLikedAndSavedItems();
        console.log("stored state")
    }
    const [mealsRendered, setMealsRendered] = useState("")

    const renderMeals = ()=>{
        if(meals){
            return meals.map((meal, index)=>{
                return <div className="meal-card" id={meal.idMeal}>
                    <div className="meal-thumbnail" >
                        <img src={meal.strMealThumb} onClick={()=>{mealRedirect(meal)}} width="300" alt={meal.strMealThumb}/>
                    </div>
                    <div className="meal-description">
                        <div className="meal-category">
                            <div className="category-tag">
                                {meal.strCategory}
                            </div>
                            <div className="area-tag">
                                {meal.strArea}
                            </div>
                            <div className="reactions">
                                <div className="heart-rect">            
                                    <img src={getHeart(meal.idMeal)} height="25"
                                        onClick={(e)=>{
                                            changeLikeState(meal.idMeal)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="meal-meal-title" onClick={()=>{mealRedirect(meal)}}>
                            <h3>{meal.strMeal}</h3>
                        </div>
                        <div className="meal-meal-description">
                            {meal.strInstructions}
                            <div className="continue-reading" onClick={()=>{mealRedirect(meal)}}>
                                <u>..Read More</u>
                            </div>
                        </div>
                    </div>
                </div>
            })
        }else{
            return <div><h1 style={{color: 'white'}}>No Results</h1></div>
        }
    } 
    return (
        <>
            <h1 className="allmeals">Meals from all cuisines</h1>
            <div className="meals">
                {mealsRendered}
            </div>
            <div style={{width: '70%', margin: '20px auto auto auto'}}>
                <Searchbar/>
            </div>
        </>
        )
}