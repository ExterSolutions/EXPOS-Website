import React, { useEffect } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import DrinksSelector from '../Selector/DrinksSelector';

function DrinksConfig({ Drinks, setDrinks, specialOfferData }) {
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
        <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <p
                  className="fw-bold text-uppercase mb-0"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}
                >
                  Choose Your Drink
                </p>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "var(--primary, #2d7a2d)",
                    background: "rgba(45,122,45,0.1)",
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  Required
                </span>
            </div>

            <div className="d-flex flex-column gap-0">
                {specialOfferData?.pops?.map((data, index) => (
                    <DrinksSelector
                        key={`pop-${index}-${data?.code}`}
                        Drinks={Drinks?.[0]}
                        data={data}
                        handleDrinks={handleDrinks}
                    />
                ))}
                {specialOfferData?.bottle?.map((data, index) => (
                    <DrinksSelector
                        key={`bottle-${index}-${data?.code}`}
                        Drinks={Drinks?.[0]}
                        data={data}
                        handleDrinks={handleDrinks}
                    />
                ))}
            </div>
        </div>
    );
}

export default DrinksConfig