import "./Styles/Style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Head from "./Components/Head";


import Home  from "./Pages/Home.jsx";
import Meals from "./Pages/Meals.jsx";
import Meal from "./Pages/Meal.jsx";
import Categories from "./Pages/Categories.jsx";
import About from "./Pages/About.jsx";
import Results from "./Pages/Results.jsx";
export default function App() {
  return (
  <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/meals/:id" element={<Meal />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
  </>
  );
}