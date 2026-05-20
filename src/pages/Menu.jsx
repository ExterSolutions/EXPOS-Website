import React, { useEffect } from 'react';
import Header from '../components/_main/Header/Header';
import Footer from '../components/_main/Footer';
import PageSEO from '../components/_main/PageSEO';
import MenuContent from '../components/Menu/MenuContent';
import LoadingLayout from '../layouts/LoadingLayout';
import { getDips, getDrinks, getOtherPizza, getSides } from '../services';

function Menu() {
    const [loading, setLoading] = React.useState(true);

    const [otherPizzas, setOtherPizzas] = React.useState([]);
    const [sides, setSides] = React.useState([]);
    const [dips, setDips] = React.useState([]);
    const [drinks, setDrinks] = React.useState([]);

    const fetchData = async () => {
        try {
            const [otherPizzasData, sidesData, dipsData, drinksData] = await Promise.all([
                getOtherPizza(),
                getSides(),
                getDips(),
                getDrinks(),
            ]);
            setOtherPizzas(otherPizzasData?.data?.slice(0, 8) || []);
            setSides(sidesData?.data?.slice(0, 8) || []);
            setDips(dipsData?.data?.slice(0, 8) || []);
            setDrinks(drinksData?.data?.slice(0, 8) || []);
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
            <PageSEO pageKey="menu" />
            <Header />
            <main style={{ flex: 1 }}>
                {/* <div className="new-block primary-background-color" id="create-your-own-new"> 
                    <section className="primary-background-color special-offers-sec new-block">*/}
                <div className="container-fluid container-lg">
                    <MenuContent
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