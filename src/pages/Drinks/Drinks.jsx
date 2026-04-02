import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import DrinkMenu from "../DrinkMenu";

const Drinks = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const initialCode = searchParams.get("code") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCode, setSelectedCode] = useState(initialCode);

  useEffect(() => {
    const q = searchParams.get("search") || "";
    const c = searchParams.get("code") || "";
    setSearchQuery(q);
    setSelectedCode(c);
  }, [searchParams]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <Header />
        <div className="nav-margin"></div>
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between innder-page-header">
            <div className="flex-grow-1 section-header">
              <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
              <div className="section-title">Drinks</div>
            </div>
          </div>
          <DrinkMenu searchQuery={searchQuery} searchCode={selectedCode} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Drinks;
