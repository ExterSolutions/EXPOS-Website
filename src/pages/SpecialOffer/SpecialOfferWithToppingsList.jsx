import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/_main/Header/Header";
import SpecialOffer from "../SpecialOffer";
import Footer from "../../components/_main/Footer";
import { GlobalContext } from "../../context/GlobalContext";
import LoadingLayout from "../../layouts/LoadingLayout";
import { getSpecialOffersWithToppingsList, settingApi } from "../../services";
import { toast } from "react-toastify";
/**
 * SpecialOfferWithToppingsList
 * ----------------------------
 * Dedicated list page for /special-offers-with-toppings
 *
 * API: GET /special-offers-with-toppings?storeCode=...
 *      (completely separate endpoint from /special-offers used by SpecialOfferList)
 *
 * Card click → /special-offers-with-toppings/:code
 *           → opens SpecialOffer.jsx (full toppings + crust + sauce + dips config)
 */
function SpecialOfferWithToppingsList() {
    const globalCtx = useContext(GlobalContext);
    const currentStoreCode = globalCtx.currentStoreCode[0];

    const [loading, setLoading] = useState(true);
    const [settingsData, setSettingsData] = useState([]);
    const specialOffersWithToppingsTitle =
        settingsData.find((item) => item.shortCode === "special-offers-with-toppings")?.settingValue ??
        "Special Pizza + Toppings";
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

    const fetchData = async () => {
        try {
            const [res, settingRes] = await Promise.all([
                getSpecialOffersWithToppingsList(currentStoreCode),
                settingApi()
            ]);
            if (res?.data && res?.data?.length > 0) {
                const activeOffers = res.data.filter(isLimitedOfferActive);
                setSpecialOfferData(activeOffers);
            } else {
                setSpecialOfferData([]);
            }
            setSettingsData(settingRes?.data);
        } catch (err) {
            toast.error("Error fetching Special Pizza with Toppings.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentStoreCode]);

    if (loading) return <LoadingLayout />;

    return (
        <div style={{ position: "relative" }}>
            <Header />
            <div className="nav-margin"></div>
            <div className="container py-2">
                <div className="d-flex align-items-center justify-content-between innder-page-header">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">{specialOffersWithToppingsTitle}</span>
                        <div className="section-title">Special Pizza + Toppings</div>
                    </div>
                </div>
                {/* 
                    basePath="/special-offers-with-toppings"
                    → card Customize → /special-offers-with-toppings/:code
                    → opens SpecialOffer.jsx (full toppings, crust, sauce, dips customisation)
                */}
                <SpecialOffer
                    specialOfferData={specialOfferData}
                    basePath="/special-offers-with-toppings"
                />
            </div>

        </div>
    );
}

export default SpecialOfferWithToppingsList;
