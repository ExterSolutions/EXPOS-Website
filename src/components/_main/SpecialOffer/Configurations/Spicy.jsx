import React from 'react';
import { SpicySelector } from '../Selector/SpicySelector';

function SpecialSpicy({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {
    // HANDLE SPICY
    const handleSpicy = (code) => {
        const selectedSpicy = specialOfferData?.spices?.find((data) => data.spicyCode === code);
        if (!selectedSpicy) return;

        const updatedSpicy = {
            spicyCode: selectedSpicy.spicyCode,
            spicy: selectedSpicy.spicy,
            price: selectedSpicy.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            spicy: updatedSpicy,
        };

        setPizzaState(updatedPizzaState);
    };
    // 
    const accordionButtonClass = `fw-bold fs-6 accordion-button ${activeAccordion === `spicy${count}` ? '' : 'collapsed'}`;
    const accordionCollapseClass = `accordion-collapse collapse ${activeAccordion === `spicy${count}` ? 'show' : ''}`;

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample2">
                <div className="accordion-item sub-accordion">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className={accordionButtonClass}
                            type="button"
                            onClick={() => toggleAccordion(`spicy${count}`)}
                            aria-expanded={activeAccordion === `spicy${count}`}
                            aria-controls="collapseTwo"
                        >
                            SPICY
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className={accordionCollapseClass}
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.spices?.map((data) => (
                                <SpicySelector
                                    key={data.code}
                                    data={data}
                                    selectedSpicy={pizzaState[count]?.spicy?.spicyCode}
                                    handleSpicy={handleSpicy}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialSpicy;