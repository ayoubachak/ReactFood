import {useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import Searchbar from '../Components/Searchbar';
import {
    filterByCategoryURL
} from '../utils/APIRoutes.js';
import axios from "axios";
import  {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';

import emptyHeart from '../images/icons/heart.png';
import heart from '../images/icons/heart-red.png'
import {appRoute} from '../utils/vars';


export default function Category(){

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    
    var category = "";
    if(location.state){
        category = location.state.category;
    }else{
        category = params.name;
    }
    
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

    
    const [categories, setSategories] = useState(null);
    useEffect(() => {
      const fetchResults = async () => {
        const results = await axios.get(filterByCategoryURL+category); 
        const unfiltredResults = results.data.meals;
        setSategories(unfiltredResults);
      }
      fetchResults();
    }, [])
    const rerenderAndSave = () => {
        setSategoriesRendered(renderSategories());
        console.log("rerendring..")
        saveLikedAndSavedItems();
        console.log("stored state")
    }
    useEffect(() => {
        rerenderAndSave();
    }, [storedMeals, categories])

    const mealRedirect = (meal)=> {
        navigate(appRoute + '/meals/'+meal.idMeal);
    }

    const [categoriesRendered, setSategoriesRendered] = useState('');
    const renderSategories = ()=>{
        if(categories){
            return categories.map((searchResult, index)=>{
                return <div className="search-result-card" id={searchResult.idMeal}>
                    <div className="search-result-thumbnail" >
                        <img src={searchResult.strMealThumb} onClick={()=>{mealRedirect(searchResult)}} width="300" alt={searchResult.strMealThumb}/>
                    </div>
                    <div className="search-result-description">
                        <div className="search-result-category">
                            <div className="category-tag" onClick={()=>{window.location.href = window.location.origin+"/category/"+category;}}>
                                {category}
                            </div>
                            <div className="reactions">
                                <div className="heart-rect">            
                                    <img src={getHeart(searchResult.idMeal)} height="25"
                                        onClick={(e)=>{
                                            changeLikeState(searchResult.idMeal)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="search-result-meal-title" onClick={()=>{mealRedirect(searchResult)}}>
                            <h3>{searchResult.strMeal}</h3>
                        </div>
                        <div className="search-result-meal-description">
                            {searchResult.strInstructions}
                            <div className="continue-reading" onClick={()=>{mealRedirect(searchResult)}}>
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

    return <>
        <h1 style={{textAlign: 'center', color:'white'}}>All for category {category} </h1>
        <div className="search-results">
            {categoriesRendered}
        </div>
        <div style={{width: '70%', margin: '20px auto auto auto'}}>
            <Searchbar/>
        </div>
    </>
}