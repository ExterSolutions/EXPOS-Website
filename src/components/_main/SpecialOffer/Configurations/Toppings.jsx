import React, { useEffect, useState, useContext } from "react";
import ToppingsTwo from "./Toppings/ToppingsTwo";
import ToppingsOne from "./Toppings/ToppingsOne";
import ToppingsFree from "./Toppings/ToppingsFree";
import { GlobalContext } from "../../../../context/GlobalContext";

function Toppings({
    count,
    toppingsData,
    pizzaState,
    setPizzaState,
    activeAccordion,
    toggleAccordion,
    noofToppings
}) {
    const { settings } = useContext(GlobalContext);
    const settingsData = settings?.[0];

    const [Topping, setTopping] = useState("two");

    const nonRegularToppingsTitle = settingsData?.find(s => s.settingCode === 'STG_5')?.settingValue || "Premium Toppings";
    const regularToppingsTitle = settingsData?.find(s => s.settingCode === 'STG_6')?.settingValue || "Regular Toppings";
    const premiumToppingCount = Number(settingsData?.find(s => s.settingCode === 'STG_7')?.settingValue || 1);

    // Toggle isAllIndiansTps Flag - TRUE OR FALSE
    useEffect(() => {
        if (
            toppingsData?.toppings?.freeToppings.length ===
            pizzaState[count]?.toppings?.freeToppings.length
        ) {
            // Update isAllIndiansTps to true
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                toppings: {
                    ...updatedPizzaState[count].toppings,
                    isAllIndiansTps: true,
                },
            };
            setPizzaState(updatedPizzaState);
        } else {
            // Update isAllIndiansTps to false
            const updatedPizzaState = [...pizzaState];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                toppings: {
                    ...updatedPizzaState[count].toppings,
                    isAllIndiansTps: false,
                },
            };
            setPizzaState(updatedPizzaState);
        }
    }, [pizzaState[count]?.toppings?.freeToppings]);

    return (
        <div className="mt-4">
            <div className="topping-header-bar" onClick={() => toggleAccordion(`toppings${count}`)}>
                <span>TOPPINGS</span>
                <span className={`fa ${activeAccordion === `toppings${count}` ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
            </div>

            <div className={`mt-2 ${activeAccordion === `toppings${count}` ? 'd-block' : 'd-none'}`}>
                <div className="badge-container px-3 py-2">
                    {noofToppings > 0 && (() => {
                        const totalSelected = pizzaState.reduce((acc, pizza) => {
                            return acc + (pizza?.toppings?.countAsOneToppings?.length || 0) + ((pizza?.toppings?.countAsTwoToppings?.length || 0) * (premiumToppingCount || 1));
                        }, 0);
                        const remaining = noofToppings - totalSelected;

                     
                    })()}
                </div>

                <div className="d-flex border-bottom">
                    <div
                        className={`topping-tab flex-grow-1 ${Topping === "two" ? "active" : ""}`}
                        onClick={() => setTopping("two")}
                    >
                        {nonRegularToppingsTitle}
                    </div>
                    <div
                        className={`topping-tab flex-grow-1 ${Topping === "one" ? "active" : ""}`}
                        onClick={() => setTopping("one")}
                    >
                        {regularToppingsTitle}
                    </div>
                    <div
                        className={`topping-tab flex-grow-1 ${Topping === "free" ? "active" : ""}`}
                        onClick={() => setTopping("free")}
                    >
                        Indian Style
                    </div>
                </div>

                <div className="px-3 mt-3">
                    {Topping === "two" &&
                        toppingsData?.toppings?.countAsTwo?.map((data, index) => {
                            return (
                                <ToppingsTwo
                                    key={index}
                                    count={count}
                                    pizzaState={pizzaState}
                                    setPizzaState={setPizzaState}
                                    data={data}
                                    noofToppings={noofToppings}
                                    premiumToppingCount={premiumToppingCount}
                                    ToppingsTwo={
                                        pizzaState[count]?.toppings?.countAsTwoToppings
                                    }
                                />
                            );
                        })}
                    {Topping === "one" &&
                        toppingsData?.toppings?.countAsOne?.map((data, index) => {
                            return (
                                <ToppingsOne
                                    key={index}
                                    count={count}
                                    pizzaState={pizzaState}
                                    setPizzaState={setPizzaState}
                                    data={data}
                                    noofToppings={noofToppings}
                                    premiumToppingCount={premiumToppingCount}
                                    ToppingsOne={
                                        pizzaState[count]?.toppings?.countAsOneToppings
                                    }
                                />
                            );
                        })}
                    {Topping === "free" &&
                        toppingsData?.toppings?.freeToppings?.map((data, index) => {
                            return (
                                <ToppingsFree
                                    key={index}
                                    count={count}
                                    pizzaState={pizzaState}
                                    setPizzaState={setPizzaState}
                                    data={data}
                                    ToppingsFree={pizzaState[count]?.toppings?.freeToppings}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default Toppings;
