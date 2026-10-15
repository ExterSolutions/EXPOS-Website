import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/_main/Header/Header';
import Footer from '../components/_main/Footer';
import PageSEO from '../components/_main/PageSEO';
import MenuContent from '../components/Menu/MenuContent';
import LoadingLayout from '../layouts/LoadingLayout';
import { GlobalContext } from '../context/GlobalContext';
import {
    getFlexDeals,
    getSignaturePizza,
    getOtherPizza,
    getSides,
    getDips,
    getDrinks,
    getAllIngredients,
} from '../services';
import { FaFire } from 'react-icons/fa';
import './menu-modern.css';

function Menu() {
    const globalCtx = useContext(GlobalContext);
    const [currentCity] = globalCtx?.currentCity || [];
    const currentStoreCode = globalCtx?.currentStoreCode?.[0];

    const [loading, setLoading] = useState(true);
    const [flexDeals, setFlexDeals] = useState([]);
    const [signaturePizzas, setSignaturePizzas] = useState([]);
    const [otherPizzas, setOtherPizzas] = useState([]);
    const [sides, setSides] = useState([]);
    const [dips, setDips] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [toppings, setToppings] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const cityCode =
                currentCity?.cityCode ??
                currentCity?.code ??
                import.meta.env.VITE_CITY_CODE ??
                null;

            const [
                flexDealsRes,
                signatureRes,
                otherPizzasRes,
                sidesRes,
                dipsRes,
                drinksRes,
                toppingsRes,
            ] = await Promise.all([
                getFlexDeals(cityCode).catch((err) => {
                    console.error('Error fetching flex deals:', err);
                    return { data: [] };
                }),
                getSignaturePizza().catch((err) => {
                    console.error('Error fetching signature pizzas:', err);
                    return { data: [] };
                }),
                getOtherPizza(currentStoreCode).catch((err) => {
                    console.error('Error fetching other pizzas:', err);
                    return { data: [] };
                }),
                getSides(currentStoreCode).catch((err) => {
                    console.error('Error fetching sides:', err);
                    return { data: [] };
                }),
                getDips().catch((err) => {
                    console.error('Error fetching dips:', err);
                    return { data: [] };
                }),
                getDrinks().catch((err) => {
                    console.error('Error fetching drinks:', err);
                    return { data: [] };
                }),
                getAllIngredients().catch((err) => {
                    console.error('Error fetching toppings:', err);
                    return { data: [] };
                }),
            ]);

            const rawFlexDeals = Array.isArray(flexDealsRes?.data)
                ? flexDealsRes.data
                : Array.isArray(flexDealsRes)
                ? flexDealsRes
                : [];

            setFlexDeals(rawFlexDeals);
            setSignaturePizzas(signatureRes?.data || []);
            setOtherPizzas(otherPizzasRes?.data || []);
            setSides(sidesRes?.data || []);
            setDips(dipsRes?.data || []);
            setDrinks(drinksRes?.data || []);
            setToppings(toppingsRes?.data || []);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentCity, currentStoreCode]);

    if (loading) return <LoadingLayout />;

    return (
        <div className="menu-page-wrapper">
            <PageSEO pageKey="menu" />
            <Header />

            {/* Menu Hero Section */}
            <header className="menu-hero">
                <div className="container-fluid container-lg">
                    <span className="menu-hero-badge">
                        <FaFire className="me-1" style={{ color: '#ff6b35' }} /> Fresh & Handcrafted Daily
                    </span>
                    <h1 className="menu-hero-title">Explore Our Full Menu</h1>
                    <p className="menu-hero-subtitle">
                        From sizzling multi-pizza deals and chef's signature pizzas to crispy sides and refreshing drinks — choose your favorites and start ordering.
                    </p>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <div className="container-fluid container-lg">
                    <MenuContent
                        flexDeals={flexDeals}
                        signaturePizzas={signaturePizzas}
                        otherPizzas={otherPizzas}
                        sides={sides}
                        dips={dips}
                        drinks={drinks}
                        topping={toppings}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Menu;