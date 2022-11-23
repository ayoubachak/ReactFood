import Magnifier from '../images/icons/magnifier.png';
import { useEffect, useState } from "react";
import  {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import axios from "axios";

import {
    searchURL,
    allCategoriesURL, 
    allAreasURL, 
    allIngredientsURL
} from '../utils/APIRoutes.js';





export default function Searchbar(){
    const location = useLocation();
    const [oldSearch, setOldSearch] = useState(localStorage.getItem("oldSearch")?localStorage.getItem("oldSearch"):"");
    const storeOldSearch = () =>{
        localStorage.setItem("oldSearch", oldSearch);
    }
    //create the search object
    const [query, setQuery] = useState('');
    const [keyword, setKeyword] = useState('');
    var search = {
        query:query,
        keyword:keyword,
        categories:[],
        areas:[],
        ingredients:[]
    };

    // form submission 
    const navigate = useNavigate();
    const onSubmit = e => {
        if(location.pathname == '/results'){
            localStorage.setItem( 'search', search );
        }else{
            e.preventDefault();
        }
        // let's fill it from the form
        search.categories = categoryFilters;
        search.areas = areaFilters;
        navigate('/results', { state: { search: search } });
    }
    
    // form live search
    const [searchResults, setSearchResults] = useState(null);
    const onChange = async e => {
        setSearchResultsDisplay('block')
        
        const searchKey = e.target.value;
        setQuery(searchURL+searchKey); // this is here because I'll need it in the search results 
        setKeyword(searchKey);
        
        setOldSearch(searchKey);
        storeOldSearch();
        const results = await axios.get(searchURL+searchKey);              
        // filter the Results

        setSearchResultsRendered(renderSearchResults(results.data.meals));
    }
    const renderSearchResults = (results)=>{
        setSearchResults(
            results
        );
        if(results){
            const filteredSearchResults = results.map((searchResult) => {
                return {
                    id:searchResult.idMeal,
                    title:searchResult.strMeal,
                    instruction:searchResult.strInstructions,
                    category:searchResult.strCategory,
                    area:searchResult.strArea,
                    visible:true
                }
            }) 
            return filteredSearchResults.map((searchResult) => {
                if (searchResult.visible){
                    return <div className="search-result" 
                        onClick={()=>{
                            const searchKey = searchResult.title;
                            console.log(searchResult.title);
                            search.query = searchURL+searchKey;
                            search.keyword = searchKey;
                            search.categories = categoryFilters;
                            search.areas = areaFilters;
                            setOldSearch(searchKey);
                            storeOldSearch();
                            console.log('search',search)
                            navigate('/results', { state: { search: search } });
                        }}>
                        <div className="search-result-title">
                        {searchResult.title}</div>
                    </div>
                }else{
                    return <div></div>
                }
            });
        }else{
            return <div>
                No Results Found
            </div>
        }
    } 
    const [searchResultsDisplay,setSearchResultsDisplay] = useState('none');     
    const [searchResultsRendered, setSearchResultsRendered] = useState('');

    // form setup 
    
    // get all categories for the filter
    const [categoryFilters, setCategoryFilters] = useState(null);

    useEffect(() => {
      const fetchCategories = async () => {
        const result = await axios.get(allCategoriesURL);
        const unfiltredCategoryFilters = result.data.meals;
        // filter the categories
        setCategoryFilters(
            unfiltredCategoryFilters.map((categoryFilterOnject, index) => {
                return { 
                    id:index,
                    category:categoryFilterOnject.strCategory,
                    checked:true
                 };
            })
        )
    };    
    fetchCategories();
    }, []);


    // get all the areas for the filter
    const [areaFilters, setAreaFilters] = useState(null);
    
    useEffect(() => {
      const fetchAreas = async () => {
        const result = await axios.get(allAreasURL);
        const unfiltredAreaFilters = result.data.meals;

        setAreaFilters(
            unfiltredAreaFilters.map((AreaFilterOnject, index) => {
                return { 
                    id:index,
                    area:AreaFilterOnject.strArea,
                    checked:true
                 };
            })
        )
    };
    fetchAreas();
    }, []);

    // if any of the checkbox filters is clicked we trigger this
    const applyFiltersOnSearchResults = ( id , filter, type)=>{
        
        // let's get the filter clicked and change it's display
        if(categoryFilters && type === 'category'){
            for(let i= 0; i< categoryFilters.length; i++){
                let categoryFilter = categoryFilters[i];
                if(id == categoryFilter.id){
                    categoryFilter.checked = !categoryFilter.checked;
                    rerenderResults(filter, 'category', categoryFilter.checked)
                }
            }
        }else if(areaFilters && type === 'area'){
            for(let i= 0; i< areaFilters.length; i++){
                let areaFilter = areaFilters[i];
                if(id == areaFilter.id){
                    areaFilter.checked = !areaFilter.checked;
                    rerenderResults(filter, 'area', areaFilter.checked)
                }
            }
        }
    }


    const rerenderResults = (filter, type, checked)=>{
        let newResults = searchResults;
        if(!newResults) return;
        if(type === 'category'){
            for(let i= 0; i<newResults.length; i++){
                let searchResult = newResults[i];
                if(filter == searchResult.strCategory){
                    searchResult.visible = checked;
                }
            }
        }else if(type === 'area'){
            for(let i= 0; i<newResults.length; i++){
                let searchResult = newResults[i];
                if(filter == searchResult.strArea){
                    searchResult.visible = checked;
                }
            }
        }
        renderSearchResults(newResults);
        
    }

    const renderCategories =  ()=>{
        if(categoryFilters){
            return categoryFilters.map((category)=>{
                return <div className="filter-item-category">
                    <input type="checkbox" name={"category-"+category.id} 
                    onClick={(e)=>{
                        let isChecked = e.target.checked;
                        applyFiltersOnSearchResults(category.id, category.category, 'category')
                        setCategoryFiltersRendered(renderCategories());
                    }}
                    checked={category.checked}
                    />
                    <label for={"category-"+category.id} style={{marginLeft:5}}>{category.category}</label>
                </div>
            })
        }
    }
    const [categoryFiltersRendered, setCategoryFiltersRendered] = useState('');
    const [categoriesfilterDisplay,setCategoriesFilterDisplay] = useState('none');     

    const renderAreas =  ()=>{
        if(areaFilters){
            return areaFilters.map((area)=>{
                return <div className="filter-item-area">
                    <input type="checkbox" name={"area-"+area.id} 
                    onClick={(e)=>{
                        let isChecked = e.target.checked;
                        applyFiltersOnSearchResults(area.id, area.area, 'area');
                        setAreaFiltersRendered(renderAreas());
                    }}
                    checked={area.checked}
                    />
                    <label for={"area-"+area.id} style={{marginLeft:5}}>{area.area}</label>
                </div>
            })
        }
    }
    const [areaFiltersRendered, setAreaFiltersRendered] = useState('')
    const [areasfilterDisplay,setAreasFilterDisplay] = useState('none');     

    const categoriesFilterClicked = ()=>{
        setAreasFilterDisplay('none');
        if(categoriesfilterDisplay === 'block'){
            setCategoriesFilterDisplay('none');
        }else{
            setCategoriesFilterDisplay('block');
        }
        setCategoryFiltersRendered(renderCategories());

    }
    const areasFilterClicked = ()=>{
        setCategoriesFilterDisplay('none');
        if(areasfilterDisplay === 'block'){
            setAreasFilterDisplay('none');
        }else{
            setAreasFilterDisplay('block');
        }
        setAreaFiltersRendered(renderAreas());
    }

    return <>
    <form action="" onSubmit={onSubmit}>
        <div className="searchbar">
            <div className="search-icon">
                <img src={Magnifier} width="32" />
            </div>
            <div className="search-live-input">
                <div className="search-live" style={{display:searchResultsDisplay}}>
                    {searchResultsRendered}
                </div>
                <div className="search-input">
                    <input type="text" onChange={onChange} size="50" value={oldSearch}/>
                </div>
            </div>
            <div className="search-filters">
                <div className="search-filter-inputs-container" style={{display:categoriesfilterDisplay}}>
                    {categoryFiltersRendered}
                </div>
                <div className="search-filter-inputs-container" style={{display:areasfilterDisplay}}>
                    { areaFiltersRendered}
                </div>
                <div className="search-filter search-category-filter" onClick={categoriesFilterClicked}>
                    Category
                </div>
                <div className="search-filter search-area-filter" onClick={areasFilterClicked}>
                    Area
                </div>
            </div>
        </div>
    </form>
    </>
}