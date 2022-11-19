import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, searchURL } from "../utils/APIRoutes";
import Header  from "../Components/Header";
import Footer from "../Components/Footer";
import Head from "../Components/Head";

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
    <Head/>
    <body>
      <Header/>
        <div className="content">

        </div>
      <Footer/>
    </body>
    </>
  );
}
