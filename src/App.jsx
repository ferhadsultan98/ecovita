import React from "react";
import "./App.scss";
import MainLayout from "./Components/Common/MainLayout";
import Home from "./Pages/Home/Home";
import MenuSection from "./Pages/MenuSection/MenuSection";
import CertificatesSection from "./Pages/Certificate/Certificate";

function App() {
  return (
    <div className="app-container">
      <MainLayout>
        <Home />
        <MenuSection />
        <CertificatesSection/>
      </MainLayout>
    </div>
  );
}

export default App;
