import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Head from './Components/Head';
import Header from './Components/Header';
import Footer from './Components/Footer';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <React.StrictMode>
      <Head/>
      <Header/>
      <App/>
      <Footer/>
    </React.StrictMode>
  </>
);
