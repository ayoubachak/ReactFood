import "./Styles/Style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Head from "./Components/Head";


import Home  from "./Pages/Home.jsx";
import Meals from "./Pages/Meals.jsx";
import Categories from "./Pages/Categories.jsx";
import About from "./Pages/About.jsx";

export default function App() {
  return (
  <>
    <div id="root">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  </>
  );
}