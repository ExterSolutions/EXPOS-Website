import React, { useEffect, useState } from "react";
import ToppingsTwo from "./Toppings/ToppingsTwo";
import ToppingsOne from "./Toppings/ToppingsOne";
import ToppingsFree from "./Toppings/ToppingsFree";

function Toppings({
    count,
    toppingsData,
    pizzaState,
    setPizzaState,
    activeAccordion,
    toggleAccordion,
    nonRegularToppingsTitle,
    regularToppingsTitle,
    premiumToppingCount,
}) {
    const [Topping, setTopping] = useState("two");
    //
    const accordionButtonClass = `fw-bold fs-6 accordion-button ${activeAccordion === `toppings${count}` ? "" : "collapsed"
        }`;
    const accordionCollapseClass = `accordion-collapse collapse ${activeAccordion === `toppings${count}` ? "show" : ""
        }`;

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
        <div className="mt-3">
            <div className="accordion" id="accordionExample9">
                <div className="accordion-item sub-accordion">
                    <h2 className="accordion-header" id="headingNine">
                        <button
                            className={accordionButtonClass}
                            type="button"
                            onClick={() => toggleAccordion(`toppings${count}`)}
                            aria-expanded={
                                activeAccordion === `toppings${count}` ? "true" : "false"
                            }
                            aria-controls="collapseNine"
                        >
                            TOPPINGS
                        </button>
                    </h2>
                    <div
                        id="collapseNine"
                        className={accordionCollapseClass}
                        aria-labelledby="headingNine"
                        data-bs-parent="#accordionExample9"
                        style={{ overflow: "hidden" }}
                    >
                        <div className="accordion-body primary-background-color">
                            <div className="pb-2 mb-2 d-flex justify-content-between row">
                                <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "two" ? "tab-border" : ""
                                        }`}
                                    onClick={() => setTopping("two")}
                                >
                                    {nonRegularToppingsTitle}
                                </div>
                                <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "one" ? "tab-border" : ""
                                        }`}
                                    onClick={() => setTopping("one")}
                                >
                                    {regularToppingsTitle}
                                </div>
                                <div
                                    className={`cursor-pointer col-4 py-2 lh-sm text-center card-text-color ${Topping === "free" ? "tab-border" : ""
                                        }`}
                                    onClick={() => setTopping("free")}
                                >
                                    Indian Style
                                </div>
                            </div>
                            {Topping === "two" &&
                                toppingsData?.toppings?.countAsTwo?.map((data, index) => {
                                    return (
                                        <ToppingsTwo
                                            key={index}
                                            count={count}
                                            pizzaState={pizzaState}
                                            setPizzaState={setPizzaState}
                                            data={data}
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
            </div>
        </div>
    );
}

export default Toppings;
