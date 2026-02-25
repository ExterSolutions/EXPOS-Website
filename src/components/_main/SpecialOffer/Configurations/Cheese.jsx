import React from 'react';
import { CheeseSelector } from '../Selector/CheeseSelector';

function SpecialCheese({ count, specialOfferData, pizzaState, setPizzaState }) {
    const getItemID = (item) => item?.code || item?.cheeseCode || item?.cheeseName || item?.name || item?.sideName || item?.pizza_cheese_name || "";

    const handleCheese = (id) => {
        const item = specialOfferData?.cheese?.find((data) => getItemID(data) === id);
        if (!item) return;

        const updatedCheese = {
            cheeseCode: getItemID(item),
            cheeseName: item.cheeseName || item.name || "Normal Cheese",
            price: item.price,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                cheese: updatedCheese,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="customization-category-label">Cheese</div>
            <div className="theme-pill-selector">
                {specialOfferData?.cheese?.map((data, index) => (
                    <CheeseSelector
                        key={`${index}-${getItemID(data)}`}
                        data={data}
                        selectedCheese={pizzaState[count]?.cheese?.cheeseCode}
                        handleCheese={handleCheese}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialCheese;