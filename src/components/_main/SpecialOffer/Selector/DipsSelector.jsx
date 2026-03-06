import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

function DipsSelector({ data, Dips = [], handleDips, handleDipsQuantity }) {
  const selectedItem = Dips?.find((item) => item.dipsCode === data?.dipsCode);
  const quantity = selectedItem ? selectedItem.quantity : 0;
  const isSelected = quantity > 0;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      handleDips(data.dipsCode, 0);
    } else {
      const payload = {
        dipsCode: data.dipsCode,
        dipsName: data.dipsName,
        quantity: Number(newQuantity),
        dipsPrice: Number(data?.price),
        totalPrice: Number(data?.price) * Number(newQuantity),
      };

      if (isSelected) {
        handleDipsQuantity(payload);
      } else {
        handleDips(data.dipsCode, newQuantity);
      }
    }
  };

  return (
    <div
      className={`rounded p-2 mb-2 theme-border ${
        isSelected ? "active text-primary" : "text-dark"
      }`}
    >
      <div className="d-flex flex-column">
        {/* Name + Price */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">{data?.dipsName}</span>
          <span className="text-muted small">
            ${Number(data?.price || 0).toFixed(2)}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-circle me-2"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 0}
          >
            <FaMinus size={12} />
          </button>

          <span className="fw-bold mx-3">{quantity}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-circle ms-2"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DipsSelector;