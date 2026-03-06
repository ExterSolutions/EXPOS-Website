import React, { memo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export const SpicySelector = ({ data, selectedSpicy, handleSpicy }) => {
  const code = data.spicyCode || data.code || "";
  const isSelected = selectedSpicy === code;
  const displayName = data.spicy || data.name || data.label || data.sideName || "Normal";

  return (
    <div
      onClick={() => handleSpicy(code)}
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

          <span>{displayName}</span>

          <span className="ms-1 text-secondary">
            (${parseFloat(data.price || 0).toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SpicySelector);