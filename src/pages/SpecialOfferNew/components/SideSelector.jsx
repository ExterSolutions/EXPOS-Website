import React, { useEffect, useState } from "react";

const SideSelector = ({ sides = [], selectedSide = [], onSelect }) => {
    const handleSelectSide = (side) => {
        const line = side.lineEntries?.[0] || {};
        onSelect([{
            sideCode: side.code,
            sideName: side.sideName,
            sideType: side.type ?? "side",
            lineCode: line.code ?? "",
            sidePrice: 0,
            sideSize: line.size ?? "",
            quantity: 1,
            totalPrice: "0.00",
        }]);
    };

    // Preselect first side if available
    useEffect(() => {
        if (sides.length > 0 && selectedSide.length === 0) {
            handleSelectSide(sides[0]);
        }
    }, [sides]);

    if (!sides.length) return null;

    const activeCode = selectedSide[0]?.sideCode;

    return (
        <div className="mb-3">
            <div className="offer-section-label mb-2">🍟 Choose Your Side</div>
            <div className="addon-card-grid">
                {sides.map((side) => {
                    const line = side.lineEntries?.[0] || {};
                    const active = activeCode === side.code;
                    return (
                        <div
                            key={side.code}
                            className={`addon-card ${active ? "addon-card--active" : ""}`}
                            onClick={() => handleSelectSide(side)}
                            role="button"
                            aria-pressed={active}
                        >
                            <div className="addon-card__check">
                                {active
                                    ? <i className="bi bi-check-circle-fill" />
                                    : <i className="bi bi-circle" />
                                }
                            </div>
                            <div className="addon-card__name">{side.sideName}</div>
                            {line.size && (
                                <div className="addon-card__sub">{line.size}</div>
                            )}
                            <div className="addon-card__price">FREE</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SideSelector;
