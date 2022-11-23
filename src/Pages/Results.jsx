import {useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import Searchbar from '../Components/Searchbar';
import {
    searchURL,
    allCategoriesURL, 
    allAreasURL, 
    allIngredientsURL
} from '../utils/APIRoutes.js';
import axios from "axios";
import  {useNavigate} from 'react-router-dom';
import emptyHeart from '../images/icons/heart.png';
import heart from '../images/icons/heart-red.png'
import {appRoute} from '../utils/vars';

const isIn = (element, array)=>{
    for (let i = 0; i < array.length; i++){
        if(array[i] === element) return true;
    }
    return false;
}

export default function Results(){
    const location = useLocation();
    const navigate = useNavigate();

    var searchState = location.state.search;
    var query = searchState.query;
    var keyword = searchState.keyword;
    var categories = searchState.categories.filter((category) => {
        return category.checked;
    }).map((category) =>{
        return category.category;
    });
    var areas = searchState.areas.filter((area) => {
        return area.checked;
    }).map((area) =>{
        return area.area;
    });;
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


    const [searchResults, setSearchResults] = useState(null);
    useEffect(() => {
      const fetchResults = async () => {
        const results = await axios.get(query); 
        const unfiltredResults = results.data.meals;
        setSearchResults(unfiltredResults.filter((result)=>{
            if((isIn(result.strCategory, categories) ) && (isIn(result.strArea , areas))) {
                return true;
            }
            return false;
        }));
      }
      fetchResults();
    }, [])
    const rerenderAndSave = () => {
        setSearchResultsRendered(renderSearchResults());
        console.log("rerendring..")
        saveLikedAndSavedItems();
        console.log("stored state")
    }
    useEffect(() => {
        rerenderAndSave();
    }, [storedMeals, searchResults])

    const mealRedirect = (meal)=> {
        navigate(appRoute + '/meals/'+meal.idMeal, { state: { meal: meal } });
    }

    const [searchResultsRendered, setSearchResultsRendered] = useState('');
    const renderSearchResults = ()=>{
        if(searchResults){
            return searchResults.map((searchResult, index)=>{
                return <div className="search-result-card" id={searchResult.idMeal}>
                    <div className="search-result-thumbnail" >
                        <img src={searchResult.strMealThumb} onClick={()=>{mealRedirect(searchResult)}} width="300" alt={searchResult.strMealThumb}/>
                    </div>
                    <div className="search-result-description">
                        <div className="search-result-category">
                            <div className="category-tag" onClick={()=>{
                                window.location.href = window.location.origin+appRoute+"/category/"+searchResult.strCategory;
                            }}>
                                {searchResult.strCategory}
                            </div>
                            <div className="area-tag" onClick={()=>{
                                window.location.href = window.location.origin+appRoute+"/area/"+searchResult.strArea;
                            }}>
                                {searchResult.strArea}
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
        <h1 style={{margin:10, color: 'white'}}>Search Results for : "{keyword}"</h1>
        <div className="search-results">
            {searchResultsRendered}
        </div>
    </>
}