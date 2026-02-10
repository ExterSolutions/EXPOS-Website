import React from 'react';
import { CrustSelector } from '../../Selector/CrustSelector';

function SpecialCrust({ count, specialOfferData, pizzaState, setPizzaState }) {
    // HANDLE CRUST
    const handleCrust = (code) => {
        const selectedCrust = specialOfferData?.crust?.find((data) => data.code === code);
        if (!selectedCrust) return;

        const updatedCrust = {
            crustCode: selectedCrust.code,
            crustName: selectedCrust.crustName,
            price: selectedCrust.price,
        };

        const updatedPizzaState = [...pizzaState];
        updatedPizzaState[count] = {
            ...updatedPizzaState[count],
            crust: updatedCrust,
        };

        setPizzaState(updatedPizzaState);
    };

    return (
        <div className="mt-3">
            <div className="">
                <div className="">
                    <h2 className="mb-3 primary-text-color" id="headingTwo">
                        CRUST
                    </h2>
                    <div className="primary-background-color">
                        {specialOfferData?.crust?.map((data) => (
                            <CrustSelector
                                key={data.code}
                                data={data}
                                selectedCrust={pizzaState[count]?.crust?.crustCode}
                                handleCrust={handleCrust}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialCrust;