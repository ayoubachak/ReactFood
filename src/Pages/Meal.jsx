import {useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import {mealByIdURL} from '../utils/APIRoutes';
import axios from "axios";
import "../Styles/Meal.css";
import emptyHeart from '../images/icons/heart.png';
import heart from '../images/icons/heart-red.png'
import Searchbar from '../Components/Searchbar';
import { useParams } from 'react-router-dom';
import {appRoute} from '../utils/vars';


export default function Meal(){
    const location = useLocation();
    const params = useParams();
    var loadedMeal = false;
    if(location.state){
        loadedMeal = location.state.meal;
    }
    const [theMeal, setTheMeal] = useState(null);
    useEffect(() => {
        if(loadedMeal){
            setTheMeal(loadedMeal);
        }else{
            const fetchMeal = async () => {
                const mealFetched = await axios.get(mealByIdURL+`${params.id}`); 
                const meal = mealFetched.data.meals[0];
                setTheMeal(meal);
            }
            fetchMeal();
        }
    },[])
    useEffect(() => {
        setMealRendered(renderTheMeal());
    }, [theMeal])

    // setting the local storage in the page
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
    const rerenderAndSave = () => {
        setMealRendered(renderTheMeal())
        console.log("rerendring..")
        saveLikedAndSavedItems();
        console.log("stored state")
    }
    //////////////////////////////////////////////////////////////// 
    const [mealRendered, setMealRendered] = useState(<div className="themeal"></div>);
    const renderTheMeal = () =>{
        if(theMeal){
            const instructions = theMeal.strInstructions;
            
            // ingredients setup
            let ingredientsNumber = 20;
            let ingredients = []
            for(let i = 1; i <= ingredientsNumber; i++){
                let ingr = theMeal['strIngredient'+i];
                let mesr = theMeal['strMeasure'+i];
                if(ingr !== ""){
                    ingredients.push(mesr + " "+ingr);
                }
            }
            return <div className="themeal">
                <div className="left-description">
                    <div className="themeal-thumbnail">
                        <img src={theMeal.strMealThumb} width="400" alt={theMeal.strMeal}/>
                    </div>
                    <div className="themeal-title">
                        <h1>{theMeal.strMeal}</h1>
                    </div>
                    <div className="tags-and-reactions">
                        <div className="tags">
                            <div className="category-tag" onClick={()=>{window.location.href = window.location.origin+appRoute+"/category/"+theMeal.strCategory;}}>
                                {theMeal.strCategory}
                            </div>
                            <div className="area-tag" onClick={()=>{window.location.href = window.location.origin+appRoute+"/area/"+theMeal.strArea;}}>
                                {theMeal.strArea}
                            </div>
                        </div>
                        <div className="reactions">
                            <div className="heart-rect">            
                                <img src={getHeart(theMeal.idMeal)} height="25"
                                    onClick={(e)=>{
                                        changeLikeState(theMeal.idMeal)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-description">
                    <h1>Ingredients / Measures :</h1>
                    <div className="ingredients">
                        {
                            ingredients.map(function(ingredient) {
                                return <div className="ingredient">
                                    {ingredient}
                                </div>
                            })
                        }
                    </div>
                    <h1>Instructions :</h1>
                    <div className="instructions">
                        {instructions}
                    </div>
                    <div className="meal-source">
                        <br></br>
                        <p>Source :<a href={theMeal.strSource}>{theMeal.strSource}</a></p>
                    </div>
                </div>

            </div>
        }else{
            return <div className="themeal"></div>
        }
    }
    console.log(theMeal);
    
    return <>
       {mealRendered} 
        
        <div style={{width: '70%', margin: 'auto auto auto auto'}}>
            <Searchbar/>
        </div>
    </>
}