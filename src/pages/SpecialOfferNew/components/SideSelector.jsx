import React, { useEffect, useState } from "react";

const SideSelector = ({ sides = [], selectedSide = [], onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const accordionId = `side-accordion`;
    const headerId = `side-header`;
    const collapseId = `side-collapse`;

    const handleToggleAccordion = () => {
        setIsOpen(pre => !isOpen);
    };

    // Preselect first side if available
    useEffect(() => {
        if (sides.length > 0 && selectedSide.length === 0) {
            const first = sides[0];
            const line = first.lineEntries?.[0] || {};
            onSelect([
                {
                    sideCode: first.code,
                    sideName: first.sideName,
                    sideType: first.type ?? "side",
                    lineCode: line.code ?? "",
                    sidePrice: 0,
                    sideSize: line.size ?? "",
                    quantity: 1,
                    totalPrice: "0.00",
                },
            ]);
        }
    }, [sides, selectedSide, onSelect]);

    if (!sides.length) return null;

    const activeCode = selectedSide[0]?.sideCode;

    const handleSelectSide = (side) => {
        const line = side.lineEntries?.[0] || {};
        const formatted = [
            {
                sideCode: side.code,
                sideName: side.sideName,
                sideType: side.type ?? "side",
                lineCode: line.code ?? "",
                sidePrice: 0,
                sideSize: line.size ?? "",
                quantity: 1,
                totalPrice: "0.00",
            },
        ];
        onSelect(formatted); // replaces old selection
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
                            Choose Your Side
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
                                {sides.map((side) => {
                                    const line = side.lineEntries?.[0] || {};
                                    const active = activeCode === side.code;
                                    return (
                                        <div
                                            key={side.code}
                                            onClick={() => handleSelectSide(side)}
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
                                                    <span className="fw-medium">{side.sideName}</span>
                                                    <span className={`small ${active ? "text-white" : "text-secondary"}`}>
                                                        ({line.size ?? "1  Box/Piece"})
                                                    </span>
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

export default SideSelector;
