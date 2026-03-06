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
            <div className="fw-medium mb-2 text-secondary">Sauce</div>
            <div className="d-flex flex-wrap gap-2">
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