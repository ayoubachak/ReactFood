import axios from 'axios';
import {useLocation} from 'react-router-dom';
import  {useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";
import '../Styles/Categories.css';
import {
    allCategoriesURL
} from '../utils/APIRoutes'
import Searchbar from '../Components/Searchbar';
import {appRoute} from '../utils/vars';


export default function Categories(){
    const navigate = useNavigate();

    const [categories, setCategories] = useState(null);
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await axios.get(allCategoriesURL)
            setCategories(categories.data.meals.map((category) => category.strCategory))
            setCategoriesRendered(renderCategories())
        }
        fetchCategories();
    },[])
    console.log(categories)
    const [categoriesRendered, setCategoriesRendered] = useState("")
    const renderCategories = ()=> {
        if(categories){
            return categories.map((category)=> {
                return <div className="category" 
                onClick={()=>{categoryRedirect(category);}}>
                    {category}
                </div>
            })
        }else{
            return <div><h1 style={{textAlign: 'center', color:'white'}}>No categories Found</h1></div>
        }
    }
    useEffect(() => {
        setCategoriesRendered(renderCategories()) 
    },[categories])
    
    const categoryRedirect = (category) => {
        navigate(appRoute+'/category/'+category, { state: { category: category } });
    }
    return (
        <>
            <h1 style={{textAlign: 'center', color:'white'}}>
                All the categories
            </h1>
            <div className="allcategories">
                {categoriesRendered}
            </div>
             
            <div style={{width: '70%', margin: 'auto auto auto auto'}}>
                <Searchbar/>
            </div>
        </>        
    )
}