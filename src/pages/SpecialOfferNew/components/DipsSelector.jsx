import React, { useEffect, useState, useCallback } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

/**
 * DipsSelector — tile-style (always visible), no accordion.
 * Each dip shows as a card with +/- quantity controls.
 * Free items shown with a "FREE" badge.
 */
const DipsSelector = ({ dips = [], freeLimit = 0, selected = [], onChange }) => {

    const [localSelection, setLocalSelection] = useState(selected || []);

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

    const recalculateSelection = useCallback(
        (updated) => {
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
        const updated = existing.quantity <= 1
            ? localSelection.filter((d) => d.dipsCode !== dip.dipsCode)
            : localSelection.map((d) =>
                d.dipsCode === dip.dipsCode ? { ...d, quantity: Number(d.quantity) - 1 } : d
            );
        recalculateSelection(updated);
    };

    const getQuantity = (code) => localSelection.find((d) => d.dipsCode === code)?.quantity || 0;

    if (freeLimit === 0 || !dips.length) return null;

    const totalSelected = localSelection.reduce((sum, d) => sum + d.quantity, 0);

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <p className="fw-bold text-uppercase mb-0" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>
                    Choose Your Dips
                </p>
                <span style={{
                    fontSize: "0.72rem", fontWeight: 600,
                    color: totalSelected >= freeLimit ? "#888" : "var(--primary, #2d7a2d)",
                    background: totalSelected >= freeLimit ? "#f0f0f0" : "rgba(45,122,45,0.1)",
                    padding: "2px 8px", borderRadius: 12,
                }}>
                    {totalSelected}/{freeLimit} free
                </span>
            </div>
            <div className="d-flex flex-column gap-2">
                {dips.map((dip) => {
                    const qty = getQuantity(dip.dipsCode);
                    const active = qty > 0;
                    return (
                        <div
                            key={dip.dipsCode}
                            className="d-flex justify-content-between align-items-center p-3 rounded-3"
                            style={{
                                border: `2px solid ${active ? "var(--primary, #2d7a2d)" : "#e0e0e0"}`,
                                background: active ? "rgba(45,122,45,0.05)" : "#fff",
                                transition: "all 0.15s",
                            }}
                        >
                            <div>
                                <div className="fw-semibold" style={{ fontSize: "0.9rem", color: "#1a1a1a" }}>
                                    {dip.dipsName}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#888" }}>
                                    {parseFloat(dip.price) > 0 ? `$${dip.price}` : (
                                        <span style={{ color: "var(--primary, #2d7a2d)", fontWeight: 600 }}>FREE</span>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDecrement(dip)}
                                    disabled={qty === 0}
                                    style={{
                                        width: 30, height: 30, borderRadius: "50%",
                                        border: "1.5px solid #ccc", background: qty === 0 ? "#f5f5f5" : "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: qty === 0 ? "not-allowed" : "pointer", flexShrink: 0,
                                    }}
                                >
                                    <FaMinus size={10} color={qty === 0 ? "#ccc" : "#555"} />
                                </button>
                                <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleIncrement(dip)}
                                    style={{
                                        width: 30, height: 30, borderRadius: "50%",
                                        border: "1.5px solid var(--primary, #2d7a2d)",
                                        background: "var(--primary, #2d7a2d)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", flexShrink: 0,
                                    }}
                                >
                                    <FaPlus size={10} color="#fff" />
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
