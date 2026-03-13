import React, { useEffect, useState } from "react";
import { getPopularItems } from "../../services";
import Pupuler from "./Pupuler";
import LoadingLayout from "../../layouts/LoadingLayout";
// import "../../assets/styles/menu-cards/signatures.css";

function PopulerPizza({ toppingsData }) {
    const [popularData, setPopularData] = useState([]);
    const [loading, setLoading] = useState(true);

    // In PopulerPizza.js
    const fetchPopularItems = async () => {
        setLoading(true);
        try {
            const storeCode = localStorage.getItem('storeCode') || null;
            const res = await getPopularItems(null, null, null, storeCode);
            const rawPopularItems = res?.data?.popularItems;
            // Check if signature items exist in popularItems
            const signatureItems = rawPopularItems?.filter(item => item.productType === 'signature');
            const allPopularItems = rawPopularItems
                ?.map(item => ({
                    ...item,  // This should preserve productType
                    pizzaName: item.name,
                    pizzaImage: item.image,
                    pizzaSubtitle: null,
                    pizza_prices: []
                })) || [];

            allPopularItems.filter(item => item.productType === 'signature');

            setPopularData(allPopularItems);
        } catch (err) {
            console.error("Error From Get Popular Items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularItems();
    }, []);

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <div className="section" id="popularmenucard">
                    <div className="container-fluid container-lg">
                        <div className="row g-3">
                            {popularData.length > 0 ? (
                                popularData.map((data) => (
                                    <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"popular-grid-card-" + data?.code}>
                                        <Pupuler data={data} toppingsData={toppingsData} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>No items available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PopulerPizza;