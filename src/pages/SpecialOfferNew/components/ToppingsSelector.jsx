import React, { useCallback, useMemo, useRef } from "react";
import { colors } from "../../../config/theme";

const TOPPING_POSITIONS = {
    whole: "Whole",
    lefthalf: "Left Half",
    righthalf: "Right Half",
    "1/4": "1/4",
};

const ToppingsSelector = ({
    title,
    options = [],
    defaultOptions = [],
    selected = [],
    onChange,
    toppingCount = 1,
    isIndianStyle = false,
}) => {
    const hasPreselectedRef = useRef(false);

    /* ---------- Memoized Lookups ---------- */
    const defaultCodes = useMemo(
        () => new Set(defaultOptions.map((t) => t.code || t.toppingsCode)),
        [defaultOptions]
    );

    const selectedMap = useMemo(
        () => new Map(selected.map((t) => [t.toppingsCode, t])),
        [selected]
    );

    /* ---------- Handlers ---------- */

    const isSelected = useCallback(
        (code) => selectedMap.has(code),
        [selectedMap]
    );

    const toggleTopping = useCallback(
        (topping) => {
            const toppingCode = topping.toppingsCode || topping.code;
            const alreadySelected = isSelected(toppingCode);

            // If already selected → remove it
            if (alreadySelected) {
                const filtered = selected.filter((t) => t.toppingsCode !== toppingCode);
                onChange(filtered);
                return;
            }

            // Prevent duplicates
            //if (selectedMap.has(toppingCode)) return;

            // Determine if topping is free (default or Indian style)
            const isFree = isIndianStyle || defaultCodes.has(toppingCode);
            const price = isFree ? "0.00" : topping.price ?? "0.00";

            const newTopping = {
                toppingsCode: toppingCode,
                toppingsName: topping.toppingsName ?? topping.name ?? "Topping",
                toppingsPrice: price,
                toppingsPlacement: "whole",
                pizzaIndex: 0,
                amount: price,
            };
            onChange([...selected, newTopping]);
        },
        [isSelected, onChange, selected, isIndianStyle, defaultCodes, selectedMap]
    );

    const updatePosition = useCallback(
        (code, placement) => {
            const updated = selected.map((t) =>
                t.toppingsCode === code ? { ...t, toppingsPlacement: placement } : t
            );
            onChange(updated);
        },
        [onChange, selected]
    );

    /* ---------- Preselect Logic (Handles Defaults & Indian Style) ---------- */
    // useEffect(() => {
    //     if (hasPreselectedRef.current) return;
    //     if (!options.length || !defaultOptions.length) return;

    //     let preselected = [];

    //     if (isIndianStyle) {
    //         preselected = options.map((opt) => ({
    //             toppingsCode: opt.toppingsCode || opt.code,
    //             toppingsName: opt.toppingsName ?? opt.name ?? "Topping",
    //             toppingsPrice: "0.00",
    //             toppingsPlacement: "whole",
    //             pizzaIndex: 0,
    //             amount: "0.00",
    //         }));
    //     } else {
    //         preselected = options
    //             .filter((opt) => defaultCodes.has(opt.toppingsCode || opt.code))
    //             .map((opt) => ({
    //                 toppingsCode: opt.toppingsCode || opt.code,
    //                 toppingsName: opt.toppingsName ?? opt.name ?? "Topping",
    //                 toppingsPrice: "0.00",
    //                 toppingsPlacement: "whole",
    //                 pizzaIndex: 0,
    //                 amount: "0.00",
    //             }));
    //     }

    //     if (preselected.length > 0) {
    //         hasPreselectedRef.current = true; // 🔒 LOCK IT
    //         onChange(preselected);
    //     }
    // }, [options, defaultOptions, defaultCodes, isIndianStyle, onChange]);

    /* ---------- Render ---------- */
    if (!options.length) return null;

    return (
        <div className="mb-3">
            {/* TITLE */}
            {/* <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-medium m-0 text-secondary">{title}</h6>
            </div> */}

            {/* OPTIONS */}
            <div className=" gap-2 mt-2">
                {options.map((opt) => {
                    const code = opt.toppingsCode || opt.code;
                    const active = isSelected(code);
                    const selectedItem = selectedMap.get(code);

                    return (
                        <div
                            key={`${title}-${code}`}
                            className={`theme-border d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded cursor-pointer transition-all`}
                            onClick={() => toggleTopping(opt)}
                            style={{
                                backgroundColor: active ? 'white' : 'white',
                                borderColor: active ? colors['primary'] : '#dee2e6', // Bootstrap's subtle border color
                            }}
                        >
                            {/* LEFT: Selection icon + Name + Price + Badge */}
                            <div className="d-flex align-items-center flex-grow-1 gap-3">
                                {/* Fixed-size icon container */}
                                <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {active ? (
                                        <i className="bi bi-check-circle-fill text-primary fs-6" />
                                    ) : (
                                        <i className="bi bi-plus-circle text-secondary fs-6" />
                                    )}
                                </div>

                                {/* Text content – explicit color control */}
                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <span className={`fw-semibold ${active ? "text-primary" : "text-dark"}`}>
                                        {opt.toppingsName ?? opt.name ?? "Topping"}
                                    </span>

                                    {!isIndianStyle && opt.price && (
                                        <span className="text-muted small">
                                            ₹{Number(opt.price).toFixed(2)}
                                        </span>
                                    )}

                                    {(isIndianStyle || defaultCodes.has(code)) && (
                                        <span className="badge bg-success-subtle text-success px-2 py-1 fs-12 fw-normal border border-success">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: Placement controls – only when active */}
                            {active && (
                                <div
                                    className="d-flex align-items-center gap-2 ps-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Whole */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm rounded-circle ${selectedItem?.toppingsPlacement === "whole"
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            width: 22,
                                            height: 22,
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => updatePosition(code, "whole")}
                                        title="Whole pizza"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="8" cy="8" r="7" />
                                        </svg>
                                    </button>

                                    {/* Left */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm rounded-circle ${selectedItem?.toppingsPlacement === "left"
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            width: 22,
                                            height: 22,
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => updatePosition(code, "left")}
                                        title="Left half"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0A8 8 0 1 0 8 16V0Z" />
                                        </svg>
                                    </button>

                                    {/* Right */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm rounded-circle ${selectedItem?.toppingsPlacement === "right"
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            width: 22,
                                            height: 22,
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => updatePosition(code, "right")}
                                        title="Right half"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            style={{ transform: "scaleX(-1)" }}
                                        >
                                            <path d="M8 0A8 8 0 1 0 8 16V0Z" />
                                        </svg>
                                    </button>

                                    {/* Quarter */}
                                    <button
                                        type="button"
                                        className={`btn btn-sm rounded-circle ${selectedItem?.toppingsPlacement === "quarter"
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            width: 22,
                                            height: 22,
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => updatePosition(code, "quarter")}
                                        title="Top-left quarter"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C3.582 0 0 3.582 0 8h8V0z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(ToppingsSelector);