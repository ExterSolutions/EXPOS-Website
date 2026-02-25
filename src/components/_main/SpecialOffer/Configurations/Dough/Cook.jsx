import React from 'react';
import { CookSelector } from '../../Selector/CookSelector';

function SpecialCook({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {

    // HANDLE COOK
    const handleCook = (code) => {
        const selectedCook = specialOfferData?.cook?.find((data) => (data.cookCode || data.code) === code);
        if (!selectedCook) return;

        const updatedCook = {
            cookCode: selectedCook.cookCode || selectedCook.code,
            cook: selectedCook.cook || selectedCook.name || "Normal",
            price: selectedCook.price,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                cook: updatedCook,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="customization-category-label">Cook</div>
            <div className="theme-pill-selector">
                {specialOfferData?.cook?.map((data) => (
                    <CookSelector
                        key={data.cookCode || data.code}
                        data={data}
                        selectedCook={pizzaState[count]?.cook?.cookCode}
                        handleCook={handleCook}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialCook;