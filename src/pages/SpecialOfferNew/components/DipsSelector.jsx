import React, { useEffect, useState, useCallback } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const DipsSelector = ({ dips = [], freeLimit = 0, selected = [], onChange }) => {

    const [localSelection, setLocalSelection] = useState(selected || []);
    const [isOpen, setIsOpen] = useState(false);
    const accordionId = `dips-accordion`;
    const headerId = `dips-header`;
    const collapseId = `dips-collapse`;

    const handleToggleAccordion = () => {
        setIsOpen(pre => !isOpen);
    };

    // Initialize with first dip if free limit > 0
    useEffect(() => {
        if (freeLimit > 0 && dips.length > 0 && localSelection.length === 0) {
            const first = dips[0];
            const initDip = {
                dipsCode: first.dipsCode,
                dipsName: first.dipsName,
                quantity: freeLimit,
                dipsPrice: first.price,
                freeQuantity: freeLimit,
                paidQuantity: 0,
                totalPrice: "0.00",
            };
            setLocalSelection([initDip]);
            onChange([initDip]);
        }
    }, [dips, freeLimit, localSelection, onChange]);

    // Helper to calculate price based on free limit
    const recalculateSelection = useCallback(
        (updated) => {
            const totalQty = updated.reduce((sum, d) => sum + d.quantity, 0);
            let freeRemaining = freeLimit;

            const recalculated = updated.map((dip) => {
                const freeQty = Math.min(dip.quantity, freeRemaining);
                const paidQty = Math.max(dip.quantity - freeQty, 0);
                freeRemaining -= freeQty;

                const totalPrice = (paidQty * parseFloat(dip.dipsPrice || 0)).toFixed(2);
                return { ...dip, freeQuantity: freeQty, paidQuantity: paidQty, totalPrice };
            });

            setLocalSelection(recalculated);
            onChange(recalculated);
        },
        [freeLimit, onChange]
    );

    const handleIncrement = (dip) => {
        const existing = localSelection.find((d) => d.dipsCode === dip.dipsCode);
        let updated;

        if (existing) {
            updated = localSelection.map((d) =>
                d.dipsCode === dip.dipsCode ? { ...d, quantity: Number(d.quantity) + 1 } : d
            );
        } else {
            updated = [
                ...localSelection,
                {
                    dipsCode: dip.dipsCode,
                    dipsName: dip.dipsName,
                    quantity: 1,
                    dipsPrice: dip.price,
                    freeQuantity: 0,
                    paidQuantity: 0,
                    totalPrice: "0.00",
                },
            ];
        }

        recalculateSelection(updated);
    };

    const handleDecrement = (dip) => {
        const existing = localSelection.find((d) => d.dipsCode === dip.dipsCode);
        if (!existing) return;

        let updated;
        if (existing.quantity <= 1) {
            updated = localSelection.filter((d) => d.dipsCode !== dip.dipsCode);
        } else {
            updated = localSelection.map((d) =>
                d.dipsCode === dip.dipsCode ? { ...d, quantity: Number(d.quantity) - 1 } : d
            );
        }

        recalculateSelection(updated);
    };

    const getQuantity = (code) => localSelection.find((d) => d.dipsCode === code)?.quantity || 0;

    if (freeLimit === 0 || !dips.length) return null;

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
                            Choose Your Dips <small className={`ms-1 ${isOpen ? "text-white" : "text-muted"}`}>(Free limit: {freeLimit})</small>
                        </button>
                    </h2>

                    <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                        aria-labelledby={headerId}
                        data-bs-parent={`#${accordionId}`}
                    >
                        <div className="accordion-body">
                            <div className="d-flex flex-column gap-2">
                                {dips.map((dip) => {
                                    const qty = getQuantity(dip.dipsCode);
                                    const active = qty > 0;
                                    return (
                                        <div
                                            key={dip.dipsCode}
                                            className={`p-2 rounded theme-border ${active ? "active" : ""
                                                }`}
                                        >
                                            <div className="d-flex flex-column">
                                                <div className="d-flex gap-2">
                                                    <strong className="text-dark fs-medium">{dip.dipsName}</strong>
                                                    <span className="small text-muted">${dip.price}</span>
                                                </div>

                                                <div className="d-flex justify-content-start align-items-center mt-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary rounded-circle me-2"
                                                        onClick={() => handleDecrement(dip)}
                                                        disabled={qty === 0}
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="fw-bold text-dark mx-3">{qty}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary rounded-circle ms-2"
                                                        onClick={() => handleIncrement(dip)}
                                                    >
                                                        <FaPlus />
                                                    </button>
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

export default DipsSelector;
