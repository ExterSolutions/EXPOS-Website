import React, { useEffect } from 'react'
import DrinksSelector from '../Selector/DrinksSelector';

function DrinksConfig({ Drinks, setDrinks, specialOfferData, activeAccordion, toggleAccordion }) {
    const handleDrinks = (code) => {
        const selected = specialOfferData?.pops?.find((drinks) => drinks?.code === code) || specialOfferData?.bottle?.find((drinks) => drinks?.code === code);
        if (selected) {
            const payload = {
                drinksCode: selected?.code,
                drinksName: selected?.softDrinkName,
                drinksPrice: selected?.price,
                quantity: 1,
                totalPrice: Number(0.0).toFixed(2),
            }
            setDrinks([payload]);
        }
    };

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample1">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                            className={`fw-bold fs-6 accordion-button ${activeAccordion === 'drinks' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => toggleAccordion('drinks')}
                            aria-expanded={activeAccordion === 'drinks' ? 'true' : 'false'}
                            aria-controls="collapseOne"
                        >
                            DRINKS
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className={`accordion-collapse collapse ${activeAccordion === 'drinks' ? 'show' : ''}`}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample1"
                        style={{ overflow: "hidden" }}
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.pops?.map((data) => (
                                <DrinksSelector
                                    key={data?.code}
                                    Drinks={Drinks[0]}
                                    setDrinks={setDrinks}
                                    data={data}
                                    handleDrinks={handleDrinks}
                                />
                            ))}
                            {specialOfferData?.bottle?.map((data) => (
                                <DrinksSelector
                                    key={data?.code}
                                    Drinks={Drinks[0]}
                                    setDrinks={setDrinks}
                                    data={data}
                                    handleDrinks={handleDrinks}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DrinksConfig