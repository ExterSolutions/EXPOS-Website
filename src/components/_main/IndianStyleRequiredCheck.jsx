import React from "react";
import { FiCheckSquare as CheckSquare, FiSquare as Square, FiAlertCircle as AlertCircle } from "react-icons/fi";

/**
 * Reusable required field component for the Customer Website asking:
 * "Do you need it Indian Style? *"
 * Provides Yes / No checkmark selection.
 * - Yes: Selects all Free (Indian Style) toppings
 * - No: Clears all Free (Indian Style) toppings
 * - null / undefined: Unanswered (Required validation blocks Add to Cart)
 */
const IndianStyleRequiredCheck = ({
  value, // 'yes' | 'no' | null
  onChange, // (choice: 'yes' | 'no') => void
  freeToppingsCount = 0,
  selectedFreeCount = 0,
  className = "",
}) => {
  const isUnanswered = value !== "yes" && value !== "no";

  return (
    <div
      data-testid="indian-style-required-field"
      className={`rounded-xl border-2 p-3.5 transition-all ${
        isUnanswered
          ? "border-amber-400 bg-amber-50/90"
          : value === "yes"
          ? "border-green-500 bg-green-50/90"
          : "border-gray-300 bg-gray-50"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            Do you need it Indian Style?{" "}
            <span className="text-red-500 font-extrabold">*</span>
          </span>
          {isUnanswered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
              <AlertCircle size={12} />
              Required
            </span>
          ) : value === "yes" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-200 text-green-900">
              All Free Toppings Selected ({selectedFreeCount || freeToppingsCount})
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
              No Indian Toppings
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            data-testid="indian-style-yes-btn"
            onClick={() => onChange("yes")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
              value === "yes"
                ? "bg-green-600 text-white border-green-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
            }`}
          >
            {value === "yes" ? (
              <CheckSquare size={16} className="text-white" />
            ) : (
              <Square size={16} className="text-gray-400" />
            )}
            <span>Yes</span>
          </button>

          <button
            type="button"
            data-testid="indian-style-no-btn"
            onClick={() => onChange("no")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
              value === "no"
                ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
            }`}
          >
            {value === "no" ? (
              <CheckSquare size={16} className="text-white" />
            ) : (
              <Square size={16} className="text-gray-400" />
            )}
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndianStyleRequiredCheck;
