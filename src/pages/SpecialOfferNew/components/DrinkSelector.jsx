import React, { useEffect, useMemo, useState } from "react";

const DrinkSelector = ({ ...props }) => {
    const { pops = [], bottle = [], selectedDrink = [], onSelect } = props;
    const [isOpen, setIsOpen] = useState(false);

    /** spread & combine all drinks together as pops, bottles */
    const allDrinks = useMemo(() => [...pops, ...bottle], [pops, bottle]);
    const accordionId = `drink-accordion`;
    const headerId = `drink-header`;
    const collapseId = `drink-collapse`;

    const handleToggleAccordion = () => {
        setIsOpen(pre => !isOpen);
    };

    // preselect the first drink which ever it is
    useEffect(() => {
        if (allDrinks.length > 0 && selectedDrink.length === 0) {
            const first = allDrinks[0];
            const formatted = [
                {
                    drinksCode: first.code,
                    drinksName: first.softDrinkName,
                    quantity: 1,
                    drinksPrice: "0.00",
                    totalPrice: "0.00",
                },
            ];
            onSelect(formatted);
        }
    }, [allDrinks, selectedDrink, onSelect]);

    if (!allDrinks.length) return null;

    const activeCode = selectedDrink[0]?.drinksCode;

    const handleSelectDrink = (drink) => {
        const formatted = [
            {
                drinksCode: drink.code,
                drinksName: drink.softDrinkName,
                quantity: 1,
                drinksPrice: "0.00",
                totalPrice: "0.00",
            },
        ];
        onSelect(formatted); // replaces previous drink
    };

    return (
        <div className="mb-3">
            <div className="accordion mb-3" id={accordionId}>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={headerId}>
                        <button
                            className={`accordion-button fw-bold ${isOpen ? "text-white" : "collapsed text-dark"}`}
                            type="button"
                            aria-expanded={isOpen ? "true" : "false"}
                            aria-controls={collapseId}
                            onClick={handleToggleAccordion}
                        >
                            Choose Your Drink
                        </button>
                    </h2>

                    <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                        aria-labelledby={headerId}
                        data-bs-parent={`#${accordionId}`}
                    >
                        <div className="accordion-body">
                            <div className="d-flex flex-column gap-3">
                                {allDrinks.map((drink) => {
                                    const active = activeCode === drink.code;
                                    return (
                                        <div
                                            key={drink.code}
                                            onClick={() => handleSelectDrink(drink)}
                                            className="d-flex justify-content-between align-items-center p-2 rounded"
                                            style={{
                                                border: "1px solid #ddd",
                                                cursor: "pointer",
                                                borderColor: active ? "#F26622" : "#ddd",
                                                color: active ? "#F26622" : "#000",
                                                fontWeight: active ? "600" : "400",
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2">
                                                    {active ? (
                                                        <i className="bi bi-check-circle-fill" />
                                                    ) : (
                                                        <i className="bi bi-plus-circle" />
                                                    )}
                                                    <span className="fw-medium">{drink.softDrinkName}</span>
                                                    <span className={`small ${active ? "text-white" : "text-secondary"}`}></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrinkSelector;
