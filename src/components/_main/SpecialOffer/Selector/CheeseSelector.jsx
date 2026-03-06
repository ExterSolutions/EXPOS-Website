import React, { memo } from "react";

const CheeseSelector = ({ data, selectedCheese, handleCheese }) => {
  const itemID =
    data?.code ||
    data?.cheeseCode ||
    data?.cheeseName ||
    data?.name ||
    data?.sideName ||
    data?.pizza_cheese_name ||
    "";

  const isSelected = !!selectedCheese && selectedCheese === itemID;

  const displayName =
    data.cheeseName || data.name || data.sideName || data.pizza_cheese_name || "Normal Cheese";

  return (
    <div
      onClick={() => handleCheese(itemID)}
      className={`rounded-sm p-2 theme-border ${isSelected ? "active text-primary" : "text-dark"}`}
      style={{ minWidth: "120px", cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span >{displayName}</span>
        <span className="ms-2">(${parseFloat(data.price || 0).toFixed(2)})</span>
      </div>
    </div>
  );
};

export default memo(CheeseSelector);