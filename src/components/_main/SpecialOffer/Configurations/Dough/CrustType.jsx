import React from 'react';
import { CrustTypeSelector } from '../../Selector/CrustTypeSelector';

function SpecialCrustType({ count, specialOfferData, pizzaState, setPizzaState }) {
    const getItemID = (item) => item?.code || item?.crustTypeCode || item?.crustType || item?.name || item?.label || "";

    const handleCrustType = (id) => {
        const item = specialOfferData?.crustType?.find((data) => getItemID(data) === id);
        if (!item) return;

        const updatedCrustType = {
            crustTypeCode: getItemID(item),
            crustTypeName: item.crustType || item.name || "Regular",
            price: item.crustTypePrice || item.price || 0,
        };

        setPizzaState((prev) => {
            const updatedPizzaState = [...prev];
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                crustType: updatedCrustType,
            };
            return updatedPizzaState;
        });
    };

    return (
        <div className="mt-3">
            <div className="customization-category-label">Crust Type</div>
            <div className="theme-pill-selector">
                {specialOfferData?.crustType?.map((data, index) => (
                    <CrustTypeSelector
                        key={`${index}-${getItemID(data)}`}
                        data={data}
                        selectedCrustType={pizzaState[count]?.crustType?.crustTypeCode}
                        handleCrustType={handleCrustType}
                    />
                ))}
            </div>
        </div>
    );
}

export default SpecialCrustType;