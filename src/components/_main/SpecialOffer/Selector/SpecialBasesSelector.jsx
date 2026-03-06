import React, { memo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export const SpecialBasesSelector = ({
  data,
  selectedSpecialBases,
  handleSpecialBases,
}) => {
  const itemID =
    data?.code ||
    data?.specialBasesCode ||
    data?.specialbaseCode ||
    data?.specialbaseName ||
    data?.name ||
    data?.specialBases ||
    "";

  const isSelected = !!selectedSpecialBases && selectedSpecialBases === itemID;

  const displayName =
    data.specialbaseName ||
    data.name ||
    data.specialBases ||
    data.sideName ||
    "None";

  return (
    <div
      onClick={() => handleSpecialBases(itemID)}
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

export default memo(SpecialBasesSelector);
