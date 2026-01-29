import React, { useState } from 'react';
import { SpecialBasesSelector } from '../../../_main/SpecialOffer/Selector/SpecialBasesSelector';

function SpecialSpecialBases({ count, specialOfferData, pizzaState, setPizzaState }) {
    // HANDLE SPECIALBASES
    const handleSpecialBases = (code) => {
        const selectedSpecialBases = specialOfferData?.specialbases?.find((data) => data.code === code);
        if (!selectedSpecialBases) return;
        const updatedPizzaState = [...pizzaState];
        // Check if the selected special base is already set for the current pizza
        if (updatedPizzaState[count]?.specialBases?.specialbaseCode === code) {
            // If the selected base is already applied, remove it by setting an empty object
            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                specialBases: {}, // Set to an empty object
            };
        } else {
            // Otherwise, update with the selected base
            const updatedSpecialBases = {
                specialbaseCode: selectedSpecialBases.code,
                specialbaseName: selectedSpecialBases.specialbaseName,
                price: selectedSpecialBases.price,
            };

            updatedPizzaState[count] = {
                ...updatedPizzaState[count],
                specialBases: updatedSpecialBases,
            };
        }
        setPizzaState(updatedPizzaState);
    };

    return (
        <div className="mt-3">
            <div className="">
                <div className="">
                    <h2 className="mb-3 primary-text-color" id="headingTwo">
                        SPECIALBASES
                    </h2>
                    <div className="primary-background-color">
                        {specialOfferData?.specialbases?.map((data) => (
                            <SpecialBasesSelector
                                key={data.code}
                                data={data}
                                selectedSpecialBases={pizzaState[count]?.specialBases?.specialbaseCode}
                                handleSpecialBases={handleSpecialBases}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default SpecialSpecialBases;