import { useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

// Placement options with color codes
const PLACEMENTS = [
    { value: "whole",     label: "Whole",  color: "#2d7a2d" },
    { value: "lefthalf",  label: "Left",   color: "#1a6bbf" },
    { value: "righthalf", label: "Right",  color: "#c06000" },
    { value: "1/4",       label: "¼",      color: "#8b3cba" },
];

export const ToppingOneSelector = ({ data, ToppingsOne, DefaultToppingsOne, handleTopping, handleSizeChange }) => {
    const [pizzaSize, setpizzaSize] = useState("whole");
    const isSelected = ToppingsOne.some(obj => obj?.code === data?.toppingsCode);
    const currentSize = ToppingsOne?.find(el => el?.code === data?.toppingsCode)?.size || pizzaSize;
    const displayPrice = DefaultToppingsOne?.find(obj => obj?.code === data?.toppingsCode)?.price ?? data?.price;

    const handleChange = (d) => {
        setpizzaSize(d);
        if (isSelected) {
            let updatedPrice = data?.price;
            const matchingDefault = DefaultToppingsOne?.find(tps => data?.toppingsCode === tps.code);
            if (matchingDefault) updatedPrice = matchingDefault?.price ?? 0;
            handleSizeChange({ code: data?.toppingsCode, name: data?.toppingsName, price: updatedPrice, type: "one", size: d });
        }
    };

    return (
        <div className={`cust-topping-row ${isSelected ? "cust-topping-row--active" : ""}`}>
            {/* Main row: checkbox + name + price */}
            <div
                className="cust-topping-row__info"
                onClick={() =>
                    handleTopping({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "one", size: pizzaSize })
                }
            >
                <span className={`cust-topping-check ${isSelected ? "cust-topping-check--on" : ""}`}>
                    {isSelected ? <FaCheck size={11} /> : <FaPlus size={11} />}
                </span>
                <span className="cust-topping-name">{data?.toppingsName}</span>
                {displayPrice !== null && displayPrice != 0 && (
                    <span className="cust-topping-price">+${displayPrice}</span>
                )}
            </div>

            {/* Placement pills — only shown when selected */}
            {isSelected && (
                <div className="cust-placement-pills">
                    {PLACEMENTS.map((pl) => (
                        <button
                            key={pl.value}
                            type="button"
                            className={`cust-placement-pill ${currentSize === pl.value ? "cust-placement-pill--active" : ""}`}
                            style={{ "--pill-color": pl.color }}
                            onClick={(e) => { e.stopPropagation(); handleChange(pl.value); }}
                        >
                            {pl.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};