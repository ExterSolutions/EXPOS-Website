import React from 'react';
import { SpecialBasesSelector } from '../../../_main/SpecialOffer/Selector/SpecialBasesSelector';

function SpecialSpecialBases({ count, specialOfferData, pizzaState, setPizzaState }) {
    const getItemID = (item) => item?.code || item?.specialBasesCode || item?.specialbaseCode || item?.specialbaseName || item?.name || item?.specialBases || "";

    const handleSpecialBases = (id) => {
        const list = specialOfferData?.specialbases || specialOfferData?.specialBases || [];
        const item = list.find((data) => getItemID(data) === id);
        if (!item) return;

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            const currentCode = updatedPizzaState[count]?.specialBases?.specialbaseCode;

            if (currentCode === id) {
                updatedPizzaState[count] = {
                    ...updatedPizzaState[count],
                    specialBases: {},
                };
            } else {
                const updatedSpecialBases = {
                    specialbaseCode: getItemID(item),
                    specialbaseName: item.specialbaseName || item.specialBases || item.name || "None",
                    price: item.price,
                };
                updatedPizzaState[count] = {
                    ...updatedPizzaState[count],
                    specialBases: updatedSpecialBases,
                };
            }
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="fw-medium mb-2 text-secondary">Special Base</div>
            <div className="d-flex flex-wrap gap-2">
                {(specialOfferData?.specialbases || specialOfferData?.specialBases)?.map((data, index) => (
                    <SpecialBasesSelector
                        key={`${index}-${getItemID(data)}`}
                        data={data}
                        selectedSpecialBases={pizzaState[count]?.specialBases?.specialbaseCode}
                        handleSpecialBases={handleSpecialBases}
                    />
                ))}
            </div>
        </div >
    );
}

export default SpecialSpecialBases;