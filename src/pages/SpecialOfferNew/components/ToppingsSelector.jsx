import React, { useCallback, useMemo, useRef } from "react";

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
                console.log(" *********** ting tong ", alreadySelected, filtered)
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
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-medium m-0 text-secondary">{title}</h6>
            </div>

            {/* OPTIONS */}
            <div className="d-flex flex-row flex-wrap gap-2 mt-2">
                {options.map((opt) => {
                    const code = opt.toppingsCode || opt.code;
                    const active = isSelected(code);
                    const selectedItem = selectedMap.get(code);

                    return (
                        <div
                            key={`${title}-${code}`}
                            className={`theme-border ${active ? "active text-primary" : "text-dark"}`}
                            onClick={() => toggleTopping(opt)}
                        >
                            {/* TOP ROW */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    {active ? (
                                        <i className="bi bi-check-circle-fill" />
                                    ) : (
                                        <i className="bi bi-plus-circle" />
                                    )}
                                    <span className="fw-semibold">
                                        {opt.toppingsName ?? opt.name ?? "Topping"}
                                    </span>
                                    {!isIndianStyle && (
                                        <span>({opt.price ?? "0.00"})</span>
                                    )}
                                    {((isIndianStyle || defaultCodes.has(code)) && (
                                        <span className="badge bg-light text-dark ms-2">
                                            Free
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* POSITION SELECTOR */}

                            <div className="row">
                                <div className="mt-2 col-12">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <select
                                            className="form-select form-select-sm"
                                            value={selectedItem?.toppingsPlacement ?? "whole"}
                                            onChange={(e) =>
                                                updatePosition(code, e.target.value)
                                            }
                                            disabled={!active}
                                        >
                                            {Object.entries(TOPPING_POSITIONS).map(
                                                ([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(ToppingsSelector);