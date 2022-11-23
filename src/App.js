import "./Styles/Style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Head from "./Components/Head";


import Home  from "./Pages/Home.jsx";
import Meals from "./Pages/Meals.jsx";
import Meal from "./Pages/Meal.jsx";
import Categories from "./Pages/Categories.jsx";
import About from "./Pages/About.jsx";
import Results from "./Pages/Results.jsx";
import Category from "./Pages/Category";
import Areas from "./Pages/Areas";
import Area from "./Pages/Area";
import Liked from "./Pages/Liked";
import {appRoute} from './utils/vars.js';

export default function App() {
  return (
  <>
      <Router>
        <Routes>
          <Route path={"/"} element={<Home/>} />
          <Route path={appRoute+"/"} element={<Home/>} />
          <Route path={appRoute+"/meals"} element={<Meals />} />
          <Route path={appRoute+"/meals/:id"} element={<Meal />} />
          <Route path={appRoute+"/categories"} element={<Categories />} />
          <Route path={appRoute+"/category/:name"} element={<Category/>} />
          <Route path={appRoute+"/areas"} element={<Areas />} />
          <Route path={appRoute+"/area/:name"} element={<Area/>} />
          <Route path={appRoute+"/liked"} element={<Liked />} />
          <Route path={appRoute+"/about"} element={<About />} />
          <Route path={appRoute+"/results"} element={<Results />} />
        </Routes>
      </Router>
  </>
  );
}