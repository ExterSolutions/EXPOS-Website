/**
 * CYOToppingTwoSelector — pill-style placement selector for Create Your Own only.
 * Signature / Special Offer continue to use ToppingTwoSelector (dropdown).
 */
import { useState } from "react";

const SIZE_OPTIONS = [
    { value: "whole",     label: "Whole" },
    { value: "righthalf", label: "½ Right" },
    { value: "lefthalf",  label: "½ Left" },
    { value: "1/4",       label: "¼" },
];

export const CYOToppingTwoSelector = ({ data, ToppingsTwo, DefaultToppingsTwo = [], handleTopping, handleSizeChange }) => {
    const [pizzaSize, setpizzaSize] = useState("whole");

    const isSelected = ToppingsTwo.some(obj => obj?.code === data?.toppingsCode);
    const currentSize = ToppingsTwo?.find(el => el?.code === data?.toppingsCode)?.size || pizzaSize;
    const displayPrice = DefaultToppingsTwo?.find(obj => obj?.code === data?.toppingsCode)?.price ?? data?.price;

    const handleSizePill = (e, val) => {
        e.stopPropagation();
        setpizzaSize(val);
        if (isSelected) {
            let updatedPrice = data?.price;
            const match = DefaultToppingsTwo?.find(tps => data?.toppingsCode === tps.code);
            if (match) updatedPrice = match?.price ?? 0;
            handleSizeChange({ code: data?.toppingsCode, name: data?.toppingsName, price: updatedPrice, type: "two", size: val });
        }
    };

    return (
        <div
            className={`theme-border ${isSelected ? 'active' : ''}`}
            onClick={() => handleTopping({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "two", size: pizzaSize })}
        >
            <div className="d-flex align-items-center gap-2">
                {isSelected ? (
                    <i className="bi bi-check-circle-fill text-primary" />
                ) : (
                    <i className="bi bi-plus-circle" />
                )}
                <span className="fw-semibold">{data?.toppingsName}</span>
                {displayPrice !== null && Number(displayPrice) > 0 && (
                    <span className="text-muted" style={{ fontSize: '0.82rem' }}>(${displayPrice})</span>
                )}
            </div>

            {/* Placement pills */}
            <div className="topping-size-pills" onClick={e => e.stopPropagation()}>
                {SIZE_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`topping-size-pill ${currentSize === opt.value ? 'topping-size-pill--active' : ''}`}
                        onClick={e => handleSizePill(e, opt.value)}
                        aria-pressed={currentSize === opt.value}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
