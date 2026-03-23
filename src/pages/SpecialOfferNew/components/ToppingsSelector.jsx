// ToppingsSelector — rewritten to match cust-topping-row style used by
// ToppingOneSelector / ToppingTwoSelector / FreeToppingSelector
// so that all pizza pages have the same topping sheet appearance.
import React, { useCallback, useMemo } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

// Placement pills — identical labels / values to the other selectors
const PLACEMENTS = [
    { value: "whole",     label: "Whole",  color: "#2d7a2d" },
    { value: "lefthalf",  label: "Left",   color: "#1a6bbf" },
    { value: "righthalf", label: "Right",  color: "#c06000" },
    { value: "1/4",       label: "¼",      color: "#8b3cba" },
];

const ToppingsSelector = ({
    title,
    options = [],
    defaultOptions = [],
    selected = [],
    onChange,
    toppingCount = 1,
    isIndianStyle = false,
}) => {
    /* ---------- Memoized lookups ---------- */
    const defaultCodes = useMemo(
        () => new Set(defaultOptions.map((t) => t.code || t.toppingsCode)),
        [defaultOptions]
    );

    const selectedMap = useMemo(
        () => new Map(selected.map((t) => [t.toppingsCode, t])),
        [selected]
    );

    const isSelected = useCallback(
        (code) => selectedMap.has(code),
        [selectedMap]
    );

    /* ---------- Toggle a topping on/off ---------- */
    const toggleTopping = useCallback(
        (opt) => {
            const code = opt.toppingsCode || opt.code;
            if (isSelected(code)) {
                onChange(selected.filter((t) => t.toppingsCode !== code));
                return;
            }
            const isFree = isIndianStyle || defaultCodes.has(code);
            const price = isFree ? "0.00" : opt.price ?? "0.00";
            const newTopping = {
                toppingsCode: code,
                toppingsName: opt.toppingsName ?? opt.name ?? "Topping",
                toppingsPrice: price,
                toppingsPlacement: "whole",
                pizzaIndex: 0,
                amount: price,
            };
            onChange([...selected, newTopping]);
        },
        [isSelected, onChange, selected, isIndianStyle, defaultCodes]
    );

    /* ---------- Update placement ---------- */
    const updatePlacement = useCallback(
        (code, placement) => {
            onChange(
                selected.map((t) =>
                    t.toppingsCode === code ? { ...t, toppingsPlacement: placement } : t
                )
            );
        },
        [onChange, selected]
    );

    if (!options.length) return null;

    return (
        <div className="topping-sheet__list">
            {options.map((opt) => {
                const code = opt.toppingsCode || opt.code;
                const active = isSelected(code);
                const selectedItem = selectedMap.get(code);
                const displayPrice = !isIndianStyle && opt.price && Number(opt.price) !== 0
                    ? `+$${Number(opt.price).toFixed(2)}`
                    : null;

                return (
                    <div
                        key={`${title}-${code}`}
                        className={`cust-topping-row ${active ? "cust-topping-row--active" : ""}`}
                    >
                        {/* Main info row */}
                        <div
                            className="cust-topping-row__info"
                            onClick={() => toggleTopping(opt)}
                        >
                            <span className={`cust-topping-check ${active ? "cust-topping-check--on" : ""}`}>
                                {active ? <FaCheck size={11} /> : <FaPlus size={11} />}
                            </span>
                            <span className="cust-topping-name">
                                {opt.toppingsName ?? opt.name ?? "Topping"}
                            </span>
                            {displayPrice && (
                                <span className="cust-topping-price">{displayPrice}</span>
                            )}
                            {(isIndianStyle || defaultCodes.has(code)) && (
                                <span className="badge bg-success-subtle text-success px-2 py-1 fw-normal border border-success" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>
                                    Free
                                </span>
                            )}
                        </div>

                        {/* Placement pills — only when selected */}
                        {active && (
                            <div className="cust-placement-pills">
                                {PLACEMENTS.map((pl) => (
                                    <button
                                        key={pl.value}
                                        type="button"
                                        className={`cust-placement-pill ${selectedItem?.toppingsPlacement === pl.value ? "cust-placement-pill--active" : ""}`}
                                        style={{ "--pill-color": pl.color }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updatePlacement(code, pl.value);
                                        }}
                                    >
                                        {pl.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(ToppingsSelector);