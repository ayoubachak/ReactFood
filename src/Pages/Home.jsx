import '../Styles/Home.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, searchURL } from "../utils/APIRoutes";
import Header  from "../Components/Header";
import Footer from "../Components/Footer";
import Head from "../Components/Head";
import Chef from '../images/chef-nobg.png';
import Searchbar from '../Components/Searchbar';

export default function Home() {
  const [meals, setMeals] = useState(null);
  useEffect(() => {
    const fetchMeals = async () => {
      const result = await axios.get(searchURL);
      setMeals(result.data);
      console.log(result.data);
    };
    fetchMeals();
  }, []);

  
  
  return (
    <>
        <div className="content">
          <div className="section">
            <div className="home-description">
              Make<br/>
              <div className="home-description-highlight">
                Delicious<br/>
              </div>
              <div style={{color: '#8A9A5B'}}>
              Meals
              </div>
            </div>
            <div className="avatar">
              <img src={Chef} height="450"/>
            </div>

          </div>
          <div className="section">
            <Searchbar/>
          </div>
        </div>
    </>
  );
}
