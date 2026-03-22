import React, { useEffect, useState, useCallback } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const DipsSelector = ({ dips = [], freeLimit = 0, selected = [], onChange }) => {
    const [localSelection, setLocalSelection] = useState(selected || []);

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
    }, [dips, freeLimit]);

    const recalculateSelection = useCallback((updated) => {
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
    }, [freeLimit, onChange]);

    const handleIncrement = (dip) => {
        const existing = localSelection.find((d) => d.dipsCode === dip.dipsCode);
        let updated;
        if (existing) {
            updated = localSelection.map((d) =>
                d.dipsCode === dip.dipsCode ? { ...d, quantity: Number(d.quantity) + 1 } : d
            );
        } else {
            updated = [...localSelection, {
                dipsCode: dip.dipsCode,
                dipsName: dip.dipsName,
                quantity: 1,
                dipsPrice: dip.price,
                freeQuantity: 0,
                paidQuantity: 0,
                totalPrice: "0.00",
            }];
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

    const totalSelected = localSelection.reduce((s, d) => s + d.quantity, 0);

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
                <div className="offer-section-label">🫙 Choose Your Dips</div>
                <span className="addon-free-badge">Free: {totalSelected}/{freeLimit}</span>
            </div>
            <div className="addon-card-grid">
                {dips.map((dip) => {
                    const qty = getQuantity(dip.dipsCode);
                    const active = qty > 0;
                    return (
                        <div
                            key={dip.dipsCode}
                            className={`addon-card addon-card--dip ${active ? "addon-card--active" : ""}`}
                        >
                            <div className="addon-card__name">{dip.dipsName}</div>
                            {dip.price && Number(dip.price) > 0 && (
                                <div className="addon-card__price">${Number(dip.price).toFixed(2)}</div>
                            )}
                            <div className="addon-card__counter">
                                <button
                                    type="button"
                                    className="addon-counter-btn"
                                    onClick={() => handleDecrement(dip)}
                                    disabled={qty === 0}
                                    aria-label="Decrease"
                                >
                                    <FaMinus size={10} />
                                </button>
                                <span className="addon-counter-qty">{qty}</span>
                                <button
                                    type="button"
                                    className="addon-counter-btn"
                                    onClick={() => handleIncrement(dip)}
                                    aria-label="Increase"
                                >
                                    <FaPlus size={10} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DipsSelector;
