import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

function DipsSelector({ data, Dips = [], handleDips, handleDipsQuantity, numberOfDips }) {
  const selectedItem = Dips?.find((item) => item.dipsCode === data?.dipsCode);
  const quantity = selectedItem ? selectedItem.quantity : 0;
  const isSelected = quantity > 0;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      if (numberOfDips > 0) {
        const totalSelectedDips = Dips?.reduce((acc, curr) => acc + curr.quantity, 0);
        if (totalSelectedDips <= 1) return;
      }
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

  const isFree = !data?.price || parseFloat(data.price) === 0;

  return (
    <div
      className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-2"
      style={{
        border: `2px solid ${isSelected ? "var(--primary, #2d7a2d)" : "#e0e0e0"}`,
        background: isSelected ? "rgba(45,122,45,0.05)" : "#fff",
        transition: "all 0.15s",
      }}
    >
      {/* Name + Price */}
      <div>
        <div className="fw-semibold" style={{ fontSize: "0.9rem", color: "#1a1a1a" }}>
          {data?.dipsName}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#888" }}>
          {isFree ? (
            <span style={{ color: "var(--primary, #2d7a2d)", fontWeight: 600 }}>FREE</span>
          ) : (
            `$${Number(data?.price || 0).toFixed(2)}`
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 0}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "1.5px solid #ccc",
            background: quantity <= 0 ? "#f5f5f5" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: quantity <= 0 ? "not-allowed" : "pointer",
            flexShrink: 0,
          }}
        >
          <FaMinus size={10} color={quantity <= 0 ? "#ccc" : "#555"} />
        </button>

        <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= 10}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "1.5px solid var(--primary, #2d7a2d)",
            background: "var(--primary, #2d7a2d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: quantity >= 10 ? "not-allowed" : "pointer",
            flexShrink: 0,
          }}
        >
          <FaPlus size={10} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export default DipsSelector;