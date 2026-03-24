/**
 * CYOFreeToppingSelector — pill-style placement selector for Create Your Own only.
 */
import { useState } from "react";

const SIZE_OPTIONS = [
    { value: "whole",     label: "Whole" },
    { value: "righthalf", label: "½ Right" },
    { value: "lefthalf",  label: "½ Left" },
    { value: "1/4",       label: "¼" },
];

export const CYOFreeToppingSelector = ({ data, ToppingsFree, handleTopping, handleSizeChange }) => {
    const [pizzaSize, setpizzaSize] = useState("whole");

    const isSelected = ToppingsFree.some(obj => obj?.code === data?.toppingsCode);
    const currentSize = ToppingsFree?.find(el => el?.code === data?.toppingsCode)?.size || pizzaSize;

    const handleSizePill = (e, val) => {
        e.stopPropagation();
        setpizzaSize(val);
        if (isSelected) {
            handleSizeChange({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "free", size: val });
        }
    };

    return (
        <div
            className={`theme-border ${isSelected ? 'active' : ''}`}
            onClick={() => handleTopping({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "free", size: pizzaSize })}
        >
            <div className="d-flex align-items-center gap-2">
                {isSelected ? (
                    <i className="bi bi-check-circle-fill text-primary" />
                ) : (
                    <i className="bi bi-plus-circle" />
                )}
                <span className="fw-semibold">{data?.toppingsName}</span>
                {data?.price !== null && Number(data?.price) > 0 && (
                    <span className="text-muted" style={{ fontSize: '0.82rem' }}>(${data?.price})</span>
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
