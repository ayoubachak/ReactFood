import axios from 'axios';
import {useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";

import {
    allCategoriesURL
} from '../utils/APIRoutes'

export default function Categories(){
    const [categories, setCategories] = useState(null);
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await axios.get(allCategoriesURL)
            setCategories(categories.data.meals.map((category) => category.strCategory))
        }
        fetchCategories();
    },[])
    console.log(categories)
    // const [categoriesRendered, setCategoriesRendered] = useState()
    return (
        <>
            All the categories
        </>        
    )
}