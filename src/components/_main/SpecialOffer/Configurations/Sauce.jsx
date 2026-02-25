import React, { useState } from 'react';
import { SauceSelector } from '../Selector/SauceSelector';

function SpecialSauce({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {
    // HANDLE SAUCE
    const handleSauce = (code) => {
        const selectedSauce = specialOfferData?.sauce?.find((data) => (data.sauceCode || data.code) === code);
        if (!selectedSauce) return;

        const updatedSauce = {
            sauceCode: selectedSauce.sauceCode || selectedSauce.code,
            sauce: selectedSauce.sauce || selectedSauce.name || "Normal Sauce",
            price: selectedSauce.price,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                sauce: updatedSauce,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="customization-category-label">Sauce</div>
            <div className="theme-pill-selector">
                {specialOfferData?.sauce?.map((data) => (
                    <SauceSelector
                        key={data.sauceCode || data.code}
                        data={data}
                        selectedSauce={pizzaState[count]?.sauce?.sauceCode}
                        handleSauce={handleSauce}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialSauce;