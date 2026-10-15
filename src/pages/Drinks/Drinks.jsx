import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import DrinkMenu from "../DrinkMenu";
import PageSEO from "../../components/_main/PageSEO";

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
        <PageSEO pageKey="drinks" />
        <Header />
        <div className="nav-margin"></div>
        <div className="container py-2">
          <DrinkMenu searchQuery={searchQuery} searchCode={selectedCode} />
        </div>

      </div>
    </>
  );
};

export default Drinks;
