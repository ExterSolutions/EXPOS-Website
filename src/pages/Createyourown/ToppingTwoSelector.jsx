import { useState } from "react";
import { IoCheckmarkCircle, IoAddCircleOutline } from "react-icons/io5";

export const ToppingTwoSelector = ({ data, ToppingsTwo, DefaultToppingsTwo = [], handleTopping, handleSizeChange }) => {
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
            className={`topping-item ${isSelected ? 'topping-item--selected' : ''}`}
            onClick={() => handleTopping({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "two", size: pizzaSize })}
        >
            <div className="topping-item__row">
                <div className="topping-item__left">
                    {isSelected
                        ? <IoCheckmarkCircle className="topping-item__check-icon" />
                        : <IoAddCircleOutline className="topping-item__add-icon" />
                    }
                    <span className="topping-item__name">{data?.toppingsName}</span>
                </div>
                {displayPrice > 0 && (
                    <span className="topping-item__price">+${Number(displayPrice).toFixed(2)}</span>
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
                        <button
                            key={opt.value}
                            type="button"
                            className={`topping-placement-pill topping-placement-pill--${opt.value} ${currentSize === opt.value ? 'topping-placement-pill--active' : ''}`}
                            onClick={e => handleSizePill(e, opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};