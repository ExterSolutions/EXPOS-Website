import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/_main/Header/Header";
import SpecialOffer from "../SpecialOffer";
import Footer from "../../components/_main/Footer";
// import "../../assets/styles/grid-cards.css";
// import "./specialoffer.css";
import {GlobalContext} from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import { specialIngredients } from "../../services";
import { toast } from "react-toastify";

function SpecialOfferList() {
    const globalCtx = useContext(GlobalContext);
    const currentStoreCode = globalCtx.currentStoreCode[0];

    const [loading, setLoading] = useState(true);
    const [specialOfferData, setSpecialOfferData] = useState([]);

    const specialOffer = async () => {
        await specialIngredients(currentStoreCode)
            .then((res) => {
                if (res?.data && res?.data?.length > 0) {
                    const activeOffers = res?.data.filter(isLimitedOfferActive);
                    setSpecialOfferData(activeOffers || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Error From Get Other Pizza :", err);
                setLoading(false);
            });
    };
    // Filter All Reacords From Deals API
    const isLimitedOfferActive = (offer) => {
        if (offer.limitedOffer === 1) {
            const currentDate = new Date();
            const startDate = new Date(offer.limitedOfferStartDate);
            const endDate = new Date(offer.limitedOfferEndDate);

            if (currentDate >= startDate && currentDate <= endDate) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        specialOffer();
    }, [currentStoreCode]);

    if (loading) return <LoadingLayout />;

    return (
        <>
            <div style={{ position: "relative" }}>
                <Header />
                <div className="nav-margin"></div>
                <div className="d-flex align-items-center justify-content-between innder-page-header">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">Craving Something New?</span>
                        <div className="section-title">Explore Our Top Deals</div>
                    </div>
                </div>
                <SpecialOffer specialOfferData={specialOfferData} />
                <Footer />
            </div>
        </>
    );
}

export default SpecialOfferList;
