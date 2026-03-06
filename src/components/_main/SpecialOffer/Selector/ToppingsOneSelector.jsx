import React, { useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function ToppingsOneSelector({ data, multiplier, ToppingsOne, handleTopping, handleSizeChange }) {
    const [pizzaSize, setPizzaSize] = useState("whole");

    // Handle Topping Placement Change 
    const handleChange = (d) => {
        setPizzaSize(d)
        if (ToppingsOne.some(obj => obj?.toppingsCode === data?.toppingsCode)) {
            let payload = {
                toppingsCode: data?.toppingsCode,
                toppingsPlacement: d
            }
            handleSizeChange(payload);
        }
    }

    const isSelected = ToppingsOne?.some(obj => obj?.toppingsCode === data?.toppingsCode);

  return (
  <div
    className={`theme-border ${isSelected ? "active text-primary" : "text-dark"}`}
    onClick={(e) => {
      if (
        e.target.tagName !== "SELECT" &&
        e.target.tagName !== "OPTION"
      ) {
        handleTopping({
          toppingsCode: data?.toppingsCode,
          toppingsName: data?.toppingsName,
          toppingsPrice: data?.price,
          type: "one",
          size: pizzaSize,
        });
      }
    }}
  >
    {/* TOP ROW */}
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        {isSelected ? (
          <i className="bi bi-check-circle-fill flex-shrink-0" />
        ) : (
          <i className="bi bi-plus-circle flex-shrink-0" />
        )}

        <span className="fw-semibold text-truncate">
          {data?.toppingsName ?? "Topping"}
        </span>

        {data?.price > 0 && (
          <span className="text-nowrap">(${data.price})</span>
        )}
      </div>
    </div>

    {/* POSITION SELECTOR */}
    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
      <select
        className="form-select form-select-sm"
        value={
          ToppingsOne?.find(
            (el) => el?.toppingsCode === data?.toppingsCode
          )?.toppingsPlacement || pizzaSize
        }
        onChange={(e) => handleChange(e.target.value)}
        disabled={!isSelected}
      >
        <option value="whole">Whole</option>
        <option value="righthalf">Right Half</option>
        <option value="lefthalf">Left Half</option>
        <option value="1/4">1/4</option>
      </select>
    </div>
  </div>
);
}

export default ToppingsOneSelector