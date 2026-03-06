import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function SidesSelector({ data, Sides, handleSides }) {
  const activeCode = Sides?.sideCode;
  const isSelected = activeCode === data?.code;

  const handleClick = () => {
    handleSides(data.code);
  };

  const line = data?.lineEntries?.[0] || {};

  return (
    <div
      onClick={handleClick}
      className="d-flex justify-content-between align-items-center p-2 rounded"
      style={{
        border: "1px solid #ddd",
        cursor: "pointer",
        borderColor: isSelected ? "#F26622" : "#ddd",
        color: isSelected ? "#F26622" : "#000",
        fontWeight: isSelected ? "600" : "400",
      }}

      
    >
      <div className="d-flex align-items-center gap-2">
        {isSelected ? (
          <i className="bi bi-check-circle-fill" />
        ) : (
           <i className="bi bi-plus-circle" />
        )}

        <span className="fw-medium">{data?.sideName}</span>

        <span
          className={`small ${isSelected ? "text-white" : "text-secondary"}`}
        >
          ({line?.size ?? "1 Box/Piece"})
        </span>
      </div>
    </div>
  );
}

export default SidesSelector;
