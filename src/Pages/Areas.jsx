import axios from 'axios';
import {useLocation} from 'react-router-dom';
import  {useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";
import '../Styles/Areas.css';
import {
    allAreasURL
} from '../utils/APIRoutes'
import Searchbar from '../Components/Searchbar';
import {appRoute} from '../utils/vars';

export default function Areas(){
    const navigate = useNavigate();

    const [areas, setAreas] = useState(null);
    useEffect(() => {
        const fetchAreas = async () => {
            const areas = await axios.get(allAreasURL)
            setAreas(areas.data.meals.map((area) => area.strArea))
            setAreasRendered(renderAreas())
        }
        fetchAreas();
    },[])
    console.log(areas)
    const [areasRendered, setAreasRendered] = useState("")
    const renderAreas = ()=> {
        if(areas){
            return areas.map((area)=> {
                return <div className="area" 
                onClick={()=>{areaRedirect(area);}}>
                    {area}
                </div>
            })
        }else{
            return <div><h1 style={{textAlign: 'center', color:'white'}}>No areas Found</h1></div>
        }
    }
    useEffect(() => {
        setAreasRendered(renderAreas()) 
    },[areas])
    
    const areaRedirect = (area) => {
        navigate(appRoute+'/area/'+area, { state: { area: area } });
    }
    return (
        <>
            <h1 style={{textAlign: 'center', color:'white'}}>
                All the areas
            </h1>
            <div className="allareas">
                {areasRendered}
            </div>
             
            <div style={{width: '70%', margin: 'auto auto auto auto'}}>
                <Searchbar/>
            </div>
        </>        
    )
}