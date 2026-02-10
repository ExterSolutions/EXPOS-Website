import { useEffect, useState } from "react";
import Drink from "../components/_main/DrinksOld/Drink";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getDrinks } from "../services";

function DrinkMenu() {
    const [drinksData, setDrinksData] = useState();
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();

    const drinks = async () => {
        setLoading(true)
        await getDrinks()
            .then((res) => {
                setDrinksData(res.data);
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error from Get Drinks Data :", err);
            }).then(() => {
                setLoading(false)
            });
    };

    useEffect(() => {
        drinks();
    }, []);

    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <div className="container">
            <div className="section mb-5" id='specialmenucard'>
                <div className="pizza-grid signature-grid">
                    {drinksData?.map((data, idx) => {
                        return (
                            <Drink
                                data={data}
                                idx={idx}
                                key={`soft-drink-` + data?.softdrinkCode}
                                cartFn={cartFn}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default DrinkMenu;
