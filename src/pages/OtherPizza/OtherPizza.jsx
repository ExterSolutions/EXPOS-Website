import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import { useEffect, useState } from "react";
import { getToppings } from "../../services";
import OtherPizza from "../OtherPizza";

const OtherPizzaList = () => {
    const [toppingsData, setToppingsData] = useState(null);

    const toppings = async () => {
        try {
            const res = await getToppings();
            setToppingsData(res?.data);
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        toppings();
    }, []);

    return (
        <>
            <div style={{ position: "relative" }}>
                <Header />
                <div className="nav-margin"></div>
                <div className="d-flex align-items-center justify-content-between innder-page-header">
                    <div className="flex-grow-1 section-header">
                        <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
                        <div className="section-title">Most Popular Pizzas</div>
                    </div>
                </div>
                <OtherPizza toppingsData={toppingsData} />
                <Footer />
            </div>
        </>
    );
};

export default OtherPizzaList;
