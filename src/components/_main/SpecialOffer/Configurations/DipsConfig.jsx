import React from "react";
import DipsSelector from "../Selector/DipsSelector";

function DipsConfig({
  Dips,
  setDips,
  dipsData,
  numberOfDips,
  activeAccordion,
  toggleAccordion,
}) {
  const handleDips = (code, selectedQuantity) => {
    const isSelected = Dips?.some((dips) => dips?.dipsCode === code);
    const selectedDip = dipsData?.find((dips) => dips?.dipsCode === code);

    if (!selectedDip) return;

    if (!isSelected) {
      const payload = {
        dipsCode: selectedDip.dipsCode,
        dipsName: selectedDip.dipsName,
        dipsPrice: Number(selectedDip.price),
        quantity: Number(selectedQuantity),
        totalPrice: Number(selectedDip?.price) * Number(selectedQuantity),
      };
      setDips((prev) => [...prev, payload]);
    } else {
      setDips((prev) => prev.filter((dips) => dips?.dipsCode !== code));
    }
  };

  const handleDipsQuantity = (payload) => {
    const updatedDips = Dips?.map((item) =>
      item.dipsCode === payload.dipsCode ? payload : item,
    );
    setDips(updatedDips);
  };

  const totalSelected = Dips?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;

  return (
    <div className="mb-3">
      {/* Header row matching SpecialOfferNew style */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <p
          className="fw-bold text-uppercase mb-0"
          style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}
        >
          Choose Your Dips
        </p>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: totalSelected >= numberOfDips ? "#888" : "var(--primary, #2d7a2d)",
            background: totalSelected >= numberOfDips ? "#f0f0f0" : "rgba(45,122,45,0.1)",
            padding: "2px 8px",
            borderRadius: 12,
          }}
        >
          {totalSelected}/{numberOfDips} free
        </span>
      </div>

      {/* Dip cards — always visible, no accordion */}
      <div className="d-flex flex-column gap-0">
        {dipsData?.map((data, index) => (
          <DipsSelector
            key={`${index}-${data?.dipsCode}`}
            Dips={Dips}
            data={data}
            handleDips={handleDips}
            handleDipsQuantity={handleDipsQuantity}
            numberOfDips={numberOfDips}
          />
        ))}
      </div>
    </div>
  );
}

export default DipsConfig;
