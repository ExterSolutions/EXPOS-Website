import React from "react";

/**
 * Reusable required field component for the Customer Website asking:
 * "Do you need it Indian Style? *"
 * Styled identically to `.topping-trigger-btn` rows (Dough, Crust Type, Cheese, etc.)
 * - Yes: Selects all Free (Indian Style) toppings
 * - No: Clears all Free (Indian Style) toppings
 * - null / undefined: Unanswered (Required validation blocks Add to Cart / Confirm)
 */
const IndianStyleRequiredCheck = ({
  choice, // 'yes' | 'no' | null
  value, // alias for choice ('yes' | 'no' | null)
  onChange, // (choice: 'yes' | 'no') => void
  className = "",
}) => {
  const selectedChoice = choice ?? value ?? null;

  const getPillStyle = (isSelected) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "0.28rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
    lineHeight: 1.2,
    border: "1.5px solid var(--primary, #2d7a2d)",
    background: isSelected ? "var(--primary, #2d7a2d)" : "#ffffff",
    color: isSelected ? "#ffffff" : "var(--primary, #2d7a2d)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  });

  return (
    <div
      data-testid="indian-style-required-field"
      className={`topping-trigger-btn ${className}`}
      style={{
        cursor: "default",
        justifyContent: "space-between",
        flexWrap: "nowrap",
      }}
    >
      <span className="topping-trigger-btn__icon" aria-hidden="true">
        🌿
      </span>
      <span
        className="topping-trigger-btn__label"
        style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}
      >
        Do you need it Indian Style?{" "}
        <span style={{ color: "#dc2626", fontWeight: 800 }} title="Mandatory">
          *
        </span>
      </span>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          data-testid="indian-style-yes-btn"
          aria-pressed={selectedChoice === "yes"}
          onClick={() => onChange && onChange("yes")}
          style={getPillStyle(selectedChoice === "yes")}
        >
          <span>{selectedChoice === "yes" ? "✓ Yes" : "Yes"}</span>
        </button>

        <button
          type="button"
          data-testid="indian-style-no-btn"
          aria-pressed={selectedChoice === "no"}
          onClick={() => onChange && onChange("no")}
          style={getPillStyle(selectedChoice === "no")}
        >
          <span>{selectedChoice === "no" ? "✓ No" : "No"}</span>
        </button>
      </div>
    </div>
  );
};

export default IndianStyleRequiredCheck;
