import React, { useState } from 'react'
import { IoCheckmarkCircle, IoAddCircleOutline } from "react-icons/io5";

function ToppingsTwoSelector({ data, multiplier, ToppingsTwo, handleTopping, handleSizeChange }) {
    const [pizzaSize, setPizzaSize] = useState("whole");

    const isSelected = ToppingsTwo?.some(obj => obj?.toppingsCode === data?.toppingsCode);
    const currentSize = ToppingsTwo?.find(el => el?.toppingsCode === data?.toppingsCode)?.toppingsPlacement || pizzaSize;

    const handleSizePill = (e, val) => {
        e.stopPropagation();
        setPizzaSize(val);
        if (isSelected) {
            handleSizeChange({ toppingsCode: data?.toppingsCode, toppingsPlacement: val });
        }
    };

    return (
        <div
            className={`topping-item ${isSelected ? 'topping-item--selected' : ''}`}
            onClick={() => handleTopping({
                toppingsCode: data?.toppingsCode,
                toppingsName: data?.toppingsName,
                toppingsPrice: data?.price,
                type: "two",
                size: pizzaSize,
            })}
        >
            <div className="topping-item__row">
                <div className="topping-item__left">
                    {isSelected
                        ? <IoCheckmarkCircle className="topping-item__check-icon" />
                        : <IoAddCircleOutline className="topping-item__add-icon" />
                    }
                    <span className="topping-item__name">{data?.toppingsName ?? "Topping"}</span>
                </div>
                {data?.price > 0 && (
                    <span className="topping-item__price">+${Number(data.price).toFixed(2)}</span>
                )}
            </div>

            {isSelected && (
                <div className="topping-placements" onClick={e => e.stopPropagation()}>
                    {[
                        { value: "whole",     label: "Whole" },
                        { value: "lefthalf",  label: "Left" },
                        { value: "righthalf", label: "Right" },
                        { value: "1/4",       label: "¼" },
                    ].map(opt => (
                        <button key={opt.value} type="button"
                            className={`topping-placement-pill topping-placement-pill--${opt.value} ${currentSize === opt.value ? 'topping-placement-pill--active' : ''}`}
                            onClick={e => handleSizePill(e, opt.value)}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ToppingsTwoSelector