import React from 'react';
import { CookSelector } from '../../Selector/CookSelector';

function SpecialCook({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {

    // HANDLE COOK
    const handleCook = (code) => {
        const selectedCook = specialOfferData?.cook?.find((data) => data.cookCode === code);
        if (!selectedCook) return;

        const updatedCook = {
            cookCode: selectedCook.cookCode,
            cook: selectedCook.cook,
            price: selectedCook.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            cook: updatedCook,
        };

        setPizzaState(updatedPizzaState);
    };

    // 
    const accordionButtonClass = `fw-bold fs-6 accordion-button ${activeAccordion === `cook${count}` ? '' : 'collapsed'}`;
    const accordionCollapseClass = `accordion-collapse collapse ${activeAccordion === `cook${count}` ? 'show' : ''}`;

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample2">
                <div className="accordion-item sub-accordion">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className={accordionButtonClass}
                            type="button"
                            onClick={() => toggleAccordion(`cook${count}`)}
                            aria-expanded={activeAccordion === `cook${count}`}
                            aria-controls="collapseTwo"
                        >
                            COOK
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        className={accordionCollapseClass}
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.cook?.map((data) => (
                                <CookSelector
                                    key={data.cookCode}
                                    data={data}
                                    selectedCook={pizzaState[count]?.cook?.cookCode}
                                    handleCook={handleCook}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialCook;