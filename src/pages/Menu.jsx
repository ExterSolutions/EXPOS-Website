import React, { useEffect } from 'react';
import Header from '../components/_main/Header/Header';
import Footer from '../components/_main/Footer';
import MenuContent from '../components/Menu/MenuContent';
import LoadingLayout from '../layouts/LoadingLayout';
import { getDips, getDrinks, getOtherPizza, getSides, getSignaturePizza, getToppings, specialIngredients } from '../services';

function Menu() {
    const [loading, setLoading] = React.useState(true);

    const [signaturePizzas, setSignaturePizzas] = React.useState([]);
    const [specialOffers, setSpecialOffers] = React.useState([]);
    const [otherPizzas, setOtherPizzas] = React.useState([]);
    const [sides, setSides] = React.useState([]);
    const [dips, setDips] = React.useState([]);
    const [drinks, setDrinks] = React.useState([]);
    const [topping, setTopping] = React.useState([]);

    const fetchData = async () => {
        try {
            const [signaturePizzasData, specialOffersData, otherPizzasData, sidesData, dipsData, drinksData, toppingData] = await Promise.all([
                getSignaturePizza(),
                specialIngredients(),
                getOtherPizza(),
                getSides(),
                getDips(),
                getDrinks(),
                getToppings(),
            ]);
            setSignaturePizzas(signaturePizzasData?.data?.slice(0, 8) || []);
            setSpecialOffers(specialOffersData?.data?.slice(0, 8) || []);
            setOtherPizzas(otherPizzasData?.data?.slice(0, 8) || []);
            setSides(sidesData?.data?.slice(0, 8) || []);
            setDips(dipsData?.data?.slice(0, 8) || []);
            setDrinks(drinksData?.data?.slice(0, 8) || []);
            setTopping(toppingData?.data?.slice(0, 4) || []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching menu data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingLayout />;

    return (
        <div className="menu-page-wrapper">
            <Header />
            <main style={{ flex: 1 }}>
                {/* <div className="new-block primary-background-color" id="create-your-own-new"> 
                    <section className="primary-background-color special-offers-sec new-block">*/}
                <div className="container-fluid container-lg">
                    <MenuContent
                        signaturePizzas={signaturePizzas}
                        topping={topping}
                        specialOffers={specialOffers}
                        otherPizzas={otherPizzas}
                        sides={sides}
                        dips={dips}
                        drinks={drinks}
                    />
                </div>
                {/* </section>
                 </div> */}
            </main>
            <Footer />
        </div>
    );
}

export default Menu;