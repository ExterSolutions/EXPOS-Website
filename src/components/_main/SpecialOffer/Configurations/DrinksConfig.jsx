import React, { useEffect } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
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
        <div className="mt-4">
            <div className="topping-header-bar" onClick={() => toggleAccordion('drinks')}>
                <span>DRINKS</span>
                {activeAccordion === 'drinks' ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            <div className={`mt-2 ${activeAccordion === 'drinks' ? 'd-block' : 'd-none'} border p-3 rounded-2`}>
                <div className="accordion-body px-0 py-2">
                    {specialOfferData?.pops?.map((data, index) => (
                        <DrinksSelector
                            key={`${index}-${data?.code}`}
                            Drinks={Drinks[0]}
                            setDrinks={setDrinks}
                            data={data}
                            handleDrinks={handleDrinks}
                        />
                    ))}
                    {specialOfferData?.bottle?.map((data, index) => (
                        <DrinksSelector
                            key={`${index}-${data?.code}`}
                            Drinks={Drinks[0]}
                            setDrinks={setDrinks}
                            data={data}
                            handleDrinks={handleDrinks}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DrinksConfig