import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/_main/Header/Header";
import SpecialOffer from "../SpecialOffer";
import Footer from "../../components/_main/Footer";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import { specialIngredients } from "../../services";
import { toast } from "react-toastify";

function SpecialOfferList() {
    const globalCtx = useContext(GlobalContext);
    const currentStoreCode = globalCtx.currentStoreCode[0];

    const [loading, setLoading] = useState(true);
    const [specialOfferData, setSpecialOfferData] = useState([]);


    const isLimitedOfferActive = (offer) => {
        if (offer.limitedOffer === 1) {
            const currentDate = new Date();
            const startDate = new Date(offer.limitedOfferStartDate);
            const endDate = new Date(offer.limitedOfferEndDate);
            return currentDate >= startDate && currentDate <= endDate;
        }
        return true;
    };

    const fetchSpecialOffers = async () => {
        try {
            const res = await specialIngredients(currentStoreCode);
            if (res?.data && res?.data?.length > 0) {
                const activeOffers = res.data.filter(isLimitedOfferActive);
                setSpecialOfferData(activeOffers);
            }
        } catch (err) {
            toast.error("Error fetching Special Deals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialOffers();
    }, [currentStoreCode]);

    if (loading) return <LoadingLayout />;

    return (
        <div style={{ position: "relative" }}>
            <Header />
            <div className="nav-margin"></div>
            <div className="container py-2">
                <div className="d-flex align-items-center justify-content-between innder-page-header">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">Craving Something New?</span>
                        <div className="section-title">Explore Our Signature Deals</div>
                    </div>
                </div>
                {/* basePath /specialoffer → opens SpecialOfferPage (new clean UI, no toppings config) */}
                <SpecialOffer specialOfferData={specialOfferData} basePath="/specialoffer" />
            </div>

        </div>
    );
}

export default SpecialOfferList;
