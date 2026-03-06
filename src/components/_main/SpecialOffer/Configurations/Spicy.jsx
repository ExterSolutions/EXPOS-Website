import React from 'react';
import { SpicySelector } from '../Selector/SpicySelector';

function SpecialSpicy({ count, specialOfferData, pizzaState, setPizzaState, activeAccordion, toggleAccordion }) {
    // HANDLE SPICY
    const handleSpicy = (code) => {
        const list = specialOfferData?.spices || specialOfferData?.spicy || [];
        const selectedSpicy = list.find((data) => (data.spicyCode || data.code) === code);
        if (!selectedSpicy) return;

        const updatedSpicy = {
            spicyCode: selectedSpicy.spicyCode || selectedSpicy.code,
            spicy: selectedSpicy.spicy || selectedSpicy.name || "Normal",
            price: selectedSpicy.price,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                spicy: updatedSpicy,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="fw-medium mb-2 text-secondary">Spicy</div>
            <div className="d-flex flex-wrap gap-2">
                {(specialOfferData?.spices || specialOfferData?.spicy)?.map((data) => (
                    <SpicySelector
                        key={data.spicyCode || data.code}
                        data={data}
                        selectedSpicy={pizzaState[count]?.spicy?.spicyCode}
                        handleSpicy={handleSpicy}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialSpicy;