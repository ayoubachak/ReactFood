import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, searchURL } from "../utils/APIRoutes";

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
    <div>
      <h1>Home</h1>
      <p>{JSON.stringify(meals)}</p>
      <h1>Meals</h1>
      <p></p>
    </div>
  );
}
