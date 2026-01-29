import React from 'react';
import { CrustTypeSelector } from '../../Selector/CrustTypeSelector';

function SpecialCrustType({ count, specialOfferData, pizzaState, setPizzaState }) {
    // HANDLE CRUSTTYPE
    const handleCrustType = (code) => {
        const selectedCrustType = specialOfferData?.crustType?.find((data) => data.crustTypeCode === code);
        if (!selectedCrustType) return;

        const updatedCrustType = {
            crustTypeCode: selectedCrustType.crustTypeCode,
            crustTypeName: selectedCrustType.crustType,
            price: selectedCrustType.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            crustType: updatedCrustType,
        };

        setPizzaState(updatedPizzaState);
    };

    return (
        <div className="mt-3">
            <div className="">
                <div className="">
                    <h2 className="mb-3 primary-text-color" id="headingTwo">
                        CRUST TYPE
                    </h2>
                    <div className="primary-background-color">
                        {specialOfferData?.crustType?.map((data) => (
                            <CrustTypeSelector
                                key={data.code}
                                data={data}
                                selectedCrustType={pizzaState[count]?.crustType?.crustTypeCode}
                                handleCrustType={handleCrustType}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialCrustType;