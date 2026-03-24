import React, { useEffect } from 'react';
import { CustomizeDrinksSelector } from './CustomizeDrinksSelector';

function CustomizeDrinkDropdown({ count, drinksType, drinkData, setSelectedDrinksTypeArr, selectedDrinksTypeArr, toggleDrinks, showDrink, setShowDrinks }) {
    const handleDrinksType = (e) => {
        const updatedArr = [...selectedDrinksTypeArr];
        updatedArr[count - 1] = e;
        setSelectedDrinksTypeArr(updatedArr);
    }

    useEffect(() => {
        setSelectedDrinksTypeArr(new Array(count).fill(drinksType[0]));
    }, [drinksType, count, setSelectedDrinksTypeArr]);

    useEffect(() => {
        if (count === 1) {
            toggleDrinks(count);
        }
    }, [count])

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample4">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button
                            className={`fw-bold fs-6 accordion-button ${showDrink === count ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => toggleDrinks(count)}
                            aria-expanded={showDrink === count ? 'true' : 'false'}
                            aria-controls="collapseFour"
                        >
                            {drinkData?.drinksType.charAt(0).toUpperCase() + drinkData?.drinksType.slice(1).toLowerCase()}{" "}
                            ({count})
                        </button>
                    </h2>
                    <div
                        id="collapseFour"
                        className={`accordion-collapse collapse ${showDrink === count ? 'show' : ''}`}
                        aria-labelledby="headingFour"
                        data-bs-parent="#accordionExample4"
                    >
                        <div className="accordion-body primary-background-color p-0">
                            <div className="d-flex flex-column">
                                {drinksType?.map((data, index) => (
                                    <CustomizeDrinksSelector
                                        key={index}
                                        data={data}
                                        selectedDrinksType={selectedDrinksTypeArr[count - 1]}
                                        handleDrinksType={handleDrinksType}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomizeDrinkDropdown;
