import React from 'react';
import { CheeseSelector } from '../Selector/CheeseSelector';

function SpecialCheese({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {
    // HANDLE CHEESE
    const handleCheese = (code) => {
        const selectedCheese = specialOfferData?.cheese?.find((data) => data.code === code);
        if (!selectedCheese) return;

        const updatedCheese = {
            cheeseCode: selectedCheese.code,
            cheeseName: selectedCheese.cheeseName,
            price: selectedCheese.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            cheese: updatedCheese,
        };

        setPizzaState(updatedPizzaState);
    };
    // 
    const accordionButtonClass = `fw-bold fs-6 accordion-button ${activeAccordion === `cheese${count}` ? '' : 'collapsed'}`;
    const accordionCollapseClass = `accordion-collapse collapse ${activeAccordion === `cheese${count}` ? 'show' : ''}`;

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample2">
                <div className="accordion-item sub-accordion">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className={accordionButtonClass}
                            type="button"
                            onClick={() => toggleAccordion(`cheese${count}`)}
                            aria-expanded={activeAccordion === `cheese${count}`}
                            aria-controls="collapseTwo"
                        >
                            CHEESE
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className={accordionCollapseClass}
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.cheese?.map((data) => (
                                <CheeseSelector
                                    key={data.code}
                                    data={data}
                                    selectedCheese={pizzaState[count]?.cheese?.cheeseCode}
                                    handleCheese={handleCheese}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialCheese;