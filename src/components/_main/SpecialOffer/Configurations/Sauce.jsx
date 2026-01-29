import React, { useState } from 'react';
import { SauceSelector } from '../Selector/SauceSelector';

function SpecialSauce({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {
    // HANDLE SAUCE
    const handleSauce = (code) => {
        const selectedSauce = specialOfferData?.sauce?.find((data) => data.sauceCode === code);
        if (!selectedSauce) return;

        const updatedSauce = {
            sauceCode: selectedSauce.sauceCode,
            sauce: selectedSauce.sauce,
            price: selectedSauce.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            sauce: updatedSauce,
        };

        setPizzaState(updatedPizzaState);
    };
    // 
    const accordionButtonClass = `fw-bold fs-6 accordion-button ${activeAccordion === `sauce${count}` ? '' : 'collapsed'}`;
    const accordionCollapseClass = `accordion-collapse collapse ${activeAccordion === `sauce${count}` ? 'show' : ''}`;

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample2">
                <div className="accordion-item sub-accordion">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className={accordionButtonClass}
                            type="button"
                            onClick={() => toggleAccordion(`sauce${count}`)}
                            aria-expanded={activeAccordion === `sauce${count}`}
                            aria-controls="collapseTwo"
                        >
                            SAUCE
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className={accordionCollapseClass}
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.sauce?.map((data) => (
                                <SauceSelector
                                    key={data.sauceCode}
                                    data={data}
                                    selectedSauce={pizzaState[count]?.sauce?.sauceCode}
                                    handleSauce={handleSauce}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialSauce;