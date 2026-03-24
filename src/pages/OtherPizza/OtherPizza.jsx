import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import { useEffect, useState } from "react";
import { getToppings } from "../../services";
import OtherPizza from "../OtherPizza";
import { GlobalContext } from "../../context/GlobalContext";
import { useContext } from "react";
import { settingApi } from "../../services";

const OtherPizzaList = () => {
    const [toppingsData, setToppingsData] = useState(null);

    const [settingsData, setSettingsData] = useState([]);
    const { settings } = useContext(GlobalContext);

    const otherPizzaTitle =
        settingsData.find((item) => item.shortCode === "otherpizza")?.settingValue ??
        "Other Pizza";

    const fetchData = async () => {
        try {
            const [toppingsRes, settingRes] = await Promise.all([
                getToppings(),
                settingApi()
            ]);
            setToppingsData(toppingsRes?.data);
            setSettingsData(settingRes?.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div style={{ position: "relative" }}>
                <Header />
                <div className="nav-margin"></div>
                <div className="container py-2">
                    <div className="d-flex align-items-center justify-content-between innder-page-header">
                        <div className="flex-grow-1 section-header">
                            <span className="category-subtitle">{otherPizzaTitle}</span>
                            <div className="section-title">Most Popular Pizzas</div>
                        </div>
                    </div>
                    <OtherPizza toppingsData={toppingsData} />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default OtherPizzaList;
