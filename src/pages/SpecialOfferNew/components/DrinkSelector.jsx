import React, { useEffect, useMemo } from "react";

const DrinkSelector = ({ pops = [], bottle = [], selectedDrink = [], onSelect }) => {
    const allDrinks = useMemo(() => [...pops, ...bottle], [pops, bottle]);

    const handleSelectDrink = (drink) => {
        onSelect([{
            drinksCode: drink.code,
            drinksName: drink.softDrinkName,
            quantity: 1,
            drinksPrice: "0.00",
            totalPrice: "0.00",
        }]);
    };

    // Preselect first drink
    useEffect(() => {
        if (allDrinks.length > 0 && selectedDrink.length === 0) {
            handleSelectDrink(allDrinks[0]);
        }
    }, [allDrinks]);

    if (!allDrinks.length) return null;

    const activeCode = selectedDrink[0]?.drinksCode;

    return (
        <div className="mb-3">
            <div className="offer-section-label mb-2">🥤 Choose Your Drink</div>
            <div className="addon-card-grid">
                {allDrinks.map((drink) => {
                    const active = activeCode === drink.code;
                    return (
                        <div
                            key={drink.code}
                            className={`addon-card ${active ? "addon-card--active" : ""}`}
                            onClick={() => handleSelectDrink(drink)}
                            role="button"
                            aria-pressed={active}
                        >
                            <div className="addon-card__check">
                                {active
                                    ? <i className="bi bi-check-circle-fill" />
                                    : <i className="bi bi-circle" />
                                }
                            </div>
                            <div className="addon-card__name">{drink.softDrinkName}</div>
                            <div className="addon-card__price">FREE</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DrinkSelector;
