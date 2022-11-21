import Magnifier from '../images/icons/magnifier.png';
import { useEffect, useState } from "react";
import  {useNavigate} from 'react-router-dom';
import axios from "axios";

import {
    searchURL,
    allCategoriesURL, 
    allAreasURL, 
    allIngredientsURL
} from '../utils/APIRoutes.js';





export default function Searchbar(){
    // form submission 
    const navigate = useNavigate();
    const onSubmit = e => {
        e.preventDefault();
        //create the search object
        var search = {
            query:"",
            categories:[],
            areas:[],
            ingredients:[]
        };
        // let's fill it from the form
        

        navigate('/results', { state: { search: 7, color: 'green' } });
    }
    
    // form live search
    const [searchResults, setSearchResults] = useState(null);
    const onChange = async e => {
        setSearchResultsDisplay('block')
        const searchKey = e.target.value;
        const results = await axios.get(searchURL+searchKey);              
        // filter the Results
        
        setSearchResults(
            results.data.meals
        );
    }
    const renderSearchResults = ()=>{
        if(searchResults){
            const filteredSearchResults = searchResults.map((searchResult) => {
                return {
                    id:searchResult.idMeal,
                    title:searchResult.strMeal,
                    instruction:searchResult.strInstructions
                }
            }) 
            return filteredSearchResults.map((searchResult) => {
                return <div className="search-result">
                    <div className="search-result-title">{searchResult.title}</div>
                    {/* <div className="search-result-instruction">{searchResult.instruction}</div> */}
                </div>
            });
        }else{
            return <div>
                No Results Found
            </div>
        }
    } 
    const [searchResultsDisplay,setSearchResultsDisplay] = useState('none');     

    // form setup 
    
    // get all categories for the filter
    const [categories, setCategories] = useState(null);
    useEffect(() => {
      const fetchCategories = async () => {
        const result = await axios.get(allCategoriesURL);
        const unfiltredCategories = result.data.meals;
        // filter the categories
        setCategories(
            unfiltredCategories.map((categoryOnject, index) => {
                return { 
                    id:index,
                    category:categoryOnject.strCategory
                 };
            })
        );
    };    
    fetchCategories();
    }, []);


    // get all the areas for the filter
    const [areas, setAreas] = useState(null);
    useEffect(() => {
      const fetchAreas = async () => {
        const result = await axios.get(allAreasURL);
        const unfiltredAreas = result.data.meals;
        setAreas(
            unfiltredAreas.map((areaObject, index)=>{
                return { 
                    id:index,
                    area:areaObject.strArea
                 };
            })
        );
    };
    fetchAreas();
    }, []);

    // get all the ingredients for the filter 
    const [ingredients, setIngredients] = useState(null);
    useEffect(() => {
      const fetchIngredients = async () => {
        const result = await axios.get(allIngredientsURL);
        const unfiltredIngredient = result.data.meals;
        setIngredients(
            unfiltredIngredient.map((ingredientObject) =>{
                return ingredientObject.strIngredient;
            })
        );
    };
    fetchIngredients();
    }, []); /// the ingredients are too much so I'll not be using them for this version 

    const renderCategories =  ()=>{
        if(categories){
            return categories.map((category)=>{
                return <div className="filter-item-category">
                    <input type="checkbox" name={"categories"+category.id} onClick={{}}/>
                    <label for={"categories"+category.id} style={{marginLeft:5}}>{category.category}</label>
                </div>
            })
        }
    }
    const [categoriesfilterDisplay,setCategoriesFilterDisplay] = useState('none');     

    const renderAreas =  ()=>{
        if(areas){
            return areas.map((area)=>{
                return <div className="filter-item-area">
                    <input type="checkbox" name={"area-"+area.id}/>
                    <label for={"area-"+area.id} style={{marginLeft:5}}>{area.area}</label>
                </div>
            })
        }
    }
    const [areasfilterDisplay,setAreasFilterDisplay] = useState('none');     

    const categoriesFilterClicked = ()=>{
        setAreasFilterDisplay('none');
        if(categoriesfilterDisplay == 'block'){
            setCategoriesFilterDisplay('none');
        }else{
            setCategoriesFilterDisplay('block');
        }
    }
    const areasFilterClicked = ()=>{
        setCategoriesFilterDisplay('none');
        if(areasfilterDisplay == 'block'){
            setAreasFilterDisplay('none');
        }else{
            setAreasFilterDisplay('block');
        }
    }

    const [filters, setFilters] = useState(null);
    const [filterDisplay,setFilterDisplay] = useState('none');     


    return <>
    <form action="" onSubmit={onSubmit}>
        <div className="searchbar">
            <div className="search-icon">
                <img src={Magnifier} width="32" />
            </div>
            <div className="search-live-input">
                <div className="search-live" style={{display:searchResultsDisplay}}>
                    {renderSearchResults()}
                </div>
                <div className="search-input">
                    <input type="text" onChange={onChange} size="50"/>
                </div>
            </div>
            <div className="search-filters">
                <div className="search-filter-inputs-container" style={{display:categoriesfilterDisplay}}>
                    {renderCategories()}
                </div>
                <div className="search-filter-inputs-container" style={{display:areasfilterDisplay}}>
                    { renderAreas()}
                </div>
                <div className="search-filter search-category-filter" onClick={categoriesFilterClicked}>
                    Category
                </div>
                <div className="search-filter search-area-filter" onClick={areasFilterClicked}>
                    Area
                </div>
                {/* <div className="search-filter search-ingredients-filter">
                    Ingredients
                </div> */}
            </div>
        </div>
    </form>
    </>
}