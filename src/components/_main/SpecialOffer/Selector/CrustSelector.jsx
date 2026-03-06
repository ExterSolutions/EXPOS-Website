import React, { memo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export const CrustSelector = ({ data, selectedCrust, handleCrust }) => {
  const itemID =
    data?.code ||
    data?.crustCode ||
    data?.crustName ||
    data?.name ||
    data?.sideName ||
    data?.pizza_crust_name ||
    "";

  const isSelected = !!selectedCrust && selectedCrust === itemID;

  const displayName =
    data.crustName ||
    data.name ||
    data.sideName ||
    data.pizza_crust_name ||
    "Regular Crust";

  return (
    <div
      onClick={() => handleCrust(itemID)}
      className={`rounded-sm p-2 theme-border ${isSelected ? "active text-primary" : "text-dark"}`}
      style={{ minWidth: "140px", cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          {isSelected ? (
            <i className="bi bi-check-circle-fill" />
          ) : (
            <i className="bi bi-plus-circle" />
          )}

          <span >{displayName}</span>

          <span className="ms-1 text-secondary">
            (${parseFloat(data.price || 0).toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(CrustSelector);
