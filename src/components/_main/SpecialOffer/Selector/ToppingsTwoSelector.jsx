import React, { useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function ToppingsTwoSelector({ data, multiplier, ToppingsTwo, handleTopping, handleSizeChange }) {
    const [pizzaSize, setPizzaSize] = useState("whole");

    // Handle Topping Placement Change 
    const handleChange = (d) => {
        setPizzaSize(d)
        if (ToppingsTwo.some(obj => obj?.toppingsCode === data?.toppingsCode)) {
            let payload = {
                toppingsCode: data?.toppingsCode,
                toppingsPlacement: d
            }
            handleSizeChange(payload);
        }
    }

    const isSelected = ToppingsTwo?.some(obj => obj?.toppingsCode === data?.toppingsCode);

    return (
        <div className={`topping-item ${isSelected ? 'active' : ''}`}
            onClick={(e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION") {
                    handleTopping({ toppingsCode: data?.toppingsCode, toppingsName: data?.toppingsName, toppingsPrice: data?.price, type: "two", size: pizzaSize })
                }
            }}>
            <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center">
                    <span className={`topping-radio-circle ${isSelected ? 'checked' : ''}`}></span>
                    <span className="topping-item-name">
                        {data?.toppingsName} {multiplier > 0 } {data?.price > 0 ? `($${data.price})` : ''}
                    </span>
                </div>
                {isSelected && <IoMdCheckmarkCircleOutline className="topping-check-icon" />}
            </div>
            <div className="mt-2 pl-4 ml-4">
                <select
                    className="topping-select"
                    value={ToppingsTwo?.find((el) => el?.toppingsCode === data?.toppingsCode)?.toppingsPlacement || pizzaSize}
                    onChange={(e) => handleChange(e.target.value)}
                >
                    <option value={"whole"}>Whole</option>
                    <option value={"righthalf"}>Right Half</option>
                    <option value={"lefthalf"}>Left Half</option>
                    <option value={"1/4"}>1/4</option>
                </select>
            </div>
        </div>
    );
}

export default ToppingsTwoSelector