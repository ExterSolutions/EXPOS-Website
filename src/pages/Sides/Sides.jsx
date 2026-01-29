import React, { useState, useMemo, useCallback } from "react";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
// import Tabs from "../../components/Tabs/Tabs";
import SidesMenu from "../SidesMenu";
import debounce from "lodash.debounce";

const Sides = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebounceSearch] = useState("");

    const debouncedSearch = useCallback(
        debounce((value) => setDebounceSearch(value), 500),
        []
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    return (
        <div style={{ position: "relative" }}>
            <Header />
            <div className="nav-margin"></div>
            <div className="d-flex align-items-center justify-content-between mt-4">
                <div className="flex-grow-1 section-header">
                    <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                    <div className="section-title">Sides</div>
                </div>
            </div>
            <div className="mb-4">
                <SidesMenu searchQuery={debouncedQuery} />
            </div>
            <Footer />
        </div>
    );
};

export default Sides;
