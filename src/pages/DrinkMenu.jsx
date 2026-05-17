import { useEffect, useState } from "react";
import Drink from "../components/_main/DrinksOld/Drink";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getDrinks } from "../services";

function DrinkMenu({ searchQuery, searchCode }) {
    const [drinksData, setDrinksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();

    const drinks = async () => {
        setLoading(true)
        try {
            const res = await getDrinks();
            setDrinksData(res.data || []);
        } catch (err) {
            console.error("Error from Get Drinks Data :", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        drinks();
    }, []);

    const filteredDrinks = searchCode || searchQuery
        ? drinksData.filter(item => {
            if (searchCode) {
                return item.code === searchCode || item.softdrinkCode === searchCode;
            }
            return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   item.softdrinkName?.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : drinksData;

    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <div className="container">
            <div className="section mb-5" id='specialmenucard'>
                <div className="mc-grid">
                    {filteredDrinks.length > 0 ? (
                        filteredDrinks.map((data, idx) => (
                            <Drink
                                data={data}
                                idx={idx}
                                key={`soft-drink-` + (data?.softdrinkCode || idx)}
                                cartFn={cartFn}
                            />
                        ))
                    ) : (
                        <div className="text-center w-100">No drinks found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DrinkMenu;
