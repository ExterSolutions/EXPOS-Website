import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import PageSEO from "../../components/_main/PageSEO";
import SidesMenu from "../SidesMenu";

const Sides = () => {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCode, setSelectedCode] = useState("");

    // Sync state with URL search params (essential for navigation within same page)
    useEffect(() => {
        const q = searchParams.get("search") || searchParams.get("q") || "";
        const c = searchParams.get("code") || "";
        setSearchQuery(q);
        setSelectedCode(c);
    }, [searchParams]);

    return (
        <div style={{ position: "relative" }}>
            <PageSEO pageKey="sides" />
            <Header />
            <div className="nav-margin"></div>
            <div className="container py-2">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Sides</div>
                    </div>
                </div>
                <div className="mb-4">
                    <SidesMenu searchQuery={searchQuery} searchCode={selectedCode} />
                </div>
            </div>
            {/* Spacer so last card isn't hidden behind the fixed bottom nav on mobile */}
            <div className="d-md-none" style={{ height: "calc(var(--bottom-nav-h, 60px) + env(safe-area-inset-bottom, 16px) + 16px)" }} />
        </div>
    );
};

export default Sides;
