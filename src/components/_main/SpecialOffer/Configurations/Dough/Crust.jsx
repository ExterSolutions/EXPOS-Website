import React from 'react';
import { CrustSelector } from '../../Selector/CrustSelector';

function SpecialCrust({ count, specialOfferData, pizzaState, setPizzaState }) {
    const getItemID = (item) => item?.code || item?.crustCode || item?.crustName || item?.name || item?.sideName || item?.pizza_crust_name || "";

    const handleCrust = (id) => {
        const item = specialOfferData?.crust?.find((data) => getItemID(data) === id);
        if (!item) return;

        const updatedCrust = {
            crustCode: getItemID(item),
            crustName: item.crustName || item.name || item.sideName || "Crust",
            price: item.price,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                crust: updatedCrust,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="fw-medium mb-2 text-secondary">Crust</div>
            <div className="d-flex flex-wrap gap-2">
                {specialOfferData?.crust?.map((data, index) => (
                    <CrustSelector
                        key={`${index}-${getItemID(data)}`}
                        data={data}
                        selectedCrust={pizzaState[count]?.crust?.crustCode}
                        handleCrust={handleCrust}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialCrust;