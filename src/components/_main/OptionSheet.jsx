// src/components/_main/OptionSheet.jsx
// Generic single-select bottom sheet / modal.
// Works for Cheese, Sauce, Spicy, Cook, Dough, CrustType etc.
// Props:
//   isOpen       bool
//   onClose      () => void
//   title        string   — e.g. "Choose Sauce"
//   options      array    — [{ id, label, price? }]
//   selected     string   — id of currently selected option
//   onSelect     (id) => void
import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

const OptionSheet = ({ isOpen, onClose, title, options = [], selected, onSelect }) => {
    const sheetRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Robust iOS-compatible body scroll lock
    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    const selectedLabel = options.find(o => o.id === selected)?.label || selected || "—";

    return (
        <>
            {/* Backdrop */}
            <div className="topping-sheet-backdrop" onClick={onClose} aria-hidden="true" />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className="topping-sheet slide-up-in"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {/* Drag handle (mobile) */}
                <div className="topping-sheet__handle" />

                {/* Header */}
                <div className="topping-sheet__header">
                    <div>
                        <p className="topping-sheet__title">{title}</p>
                        {selected && (
                            <p className="topping-sheet__subtitle">Current: <strong>{selectedLabel}</strong></p>
                        )}
                    </div>
                    <button className="topping-sheet__close" onClick={onClose} aria-label="Close">
                        <IoMdClose size={20} />
                    </button>
                </div>

                {/* Option list */}
                <div className="option-sheet__body">
                    {options.map((opt) => {
                        const isActive = opt.id === selected;
                        return (
                            <button
                                key={opt.id}
                                className={`option-sheet__row ${isActive ? "option-sheet__row--active" : ""}`}
                                onClick={() => { onSelect(opt.id); onClose(); }}
                            >
                                <span className={`option-sheet__check ${isActive ? "option-sheet__check--on" : ""}`}>
                                    {isActive ? "✓" : ""}
                                </span>
                                <span className="option-sheet__label">{opt.label}</span>
                                {opt.price > 0 && (
                                    <span className="option-sheet__price">+${opt.price}</span>
                                )}
                            </button>
                        );
                    })}
                    {options.length === 0 && (
                        <p className="text-secondary text-center py-4">No options available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default OptionSheet;
