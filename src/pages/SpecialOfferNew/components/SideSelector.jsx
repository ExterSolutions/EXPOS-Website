import React, { useEffect } from "react";

/**
 * SideSelector — tile-style (always visible), no accordion.
 * Active tile gets green border + checkmark.
 */
const SideSelector = ({ sides = [], selectedSide = [], onSelect }) => {

    // Preselect first side if nothing selected
    useEffect(() => {
        if (sides.length > 0 && selectedSide.length === 0) {
            const first = sides[0];
            const line = first.lineEntries?.[0] || {};
            onSelect([{
                sideCode: first.code,
                sideName: first.sideName,
                sideType: first.type ?? "side",
                lineCode: line.code ?? "",
                sidePrice: 0,
                sideSize: line.size ?? "",
                quantity: 1,
                totalPrice: "0.00",
            }]);
        }
    }, [sides, selectedSide, onSelect]);

    if (!sides.length) return null;

    const activeCode = selectedSide[0]?.sideCode;

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

    return (
        <div className="mb-3">
            <p className="fw-bold text-uppercase mb-2" style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}>
                Choose Your Side
            </p>
            <div className="d-flex flex-column gap-2">
                {sides.map((side) => {
                    const line = side.lineEntries?.[0] || {};
                    const active = activeCode === side.code;
                    return (
                        <div
                            key={side.code}
                            onClick={() => handleSelectSide(side)}
                            className="d-flex justify-content-between align-items-center p-3 rounded-3"
                            style={{
                                border: `2px solid ${active ? "var(--primary, #2d7a2d)" : "#e0e0e0"}`,
                                background: active ? "rgba(45,122,45,0.06)" : "#fff",
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <span style={{
                                    width: 22, height: 22, borderRadius: "50%",
                                    border: `2px solid ${active ? "var(--primary, #2d7a2d)" : "#ccc"}`,
                                    background: active ? "var(--primary, #2d7a2d)" : "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    {active && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                                </span>
                                <span className="fw-semibold" style={{ color: active ? "var(--primary, #2d7a2d)" : "#1a1a1a", fontSize: "0.9rem" }}>
                                    {side.sideName}
                                </span>
                            </div>
                            <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                                {line.size ?? "1 Box"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SideSelector;
