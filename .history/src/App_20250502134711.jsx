import React from "react";
import "./App.scss";
import MainLayout from "./Components/Common/MainLayout";
import Home from "./Pages/Home/Home";
import MenuSection from "./Pages/MenuSection/MenuSection";

function App() {
  return (
    <div className="app-container">
      <MainLayout>
        <Home />
        <MenuSection />
      </MainLayout>
    </div>
  );
}

export default App;
