// src/components/_main/ToppingSheet.jsx
// Shared bottom-sheet / modal for selecting toppings across
// all pizza customization screens (Signature, Create Your Own, etc.)
import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

/**
 * ToppingSheet — slides up from the bottom on mobile, centered modal on desktop.
 *
 * Props:
 *   isOpen             bool
 *   onClose            () => void
 *   activeTab          "two" | "one" | "free"
 *   setActiveTab       (tab) => void
 *   Ingredients        object   (the full ingredients response)
 *   ToppingsTwo        array
 *   ToppingsOne        array
 *   ToppingsFree       array
 *   handleToppingsTwo  (payload) => void
 *   handleToppingOne   (payload) => void
 *   handleFreeToppings (payload) => void
 *   handleSizeChange   (payload) => void
 *   ToppingTwoSelector component
 *   ToppingOneSelector component
 *   FreeToppingSelector component
 *   DefaultToppingsTwo  array (optional, for Signature)
 *   DefaultToppingsOne  array (optional, for Signature)
 *   nonRegularTitle    string
 *   regularTitle       string
 */
const ToppingSheet = ({
    isOpen,
    onClose,
    activeTab,
    setActiveTab,
    Ingredients,
    ToppingsTwo,
    ToppingsOne,
    ToppingsFree,
    handleToppingsTwo,
    handleToppingOne,
    handleFreeToppings,
    handleSizeChange,
    ToppingTwoSelector,
    ToppingOneSelector,
    FreeToppingSelector,
    DefaultToppingsTwo = [],
    DefaultToppingsOne = [],
    nonRegularTitle = "Premium Toppings",
    regularTitle = "Regular Toppings",
    indianStyleTitle = "Indian Toppings",
}) => {
    const sheetRef = useRef(null);

    // count selected per tab for badge display
    const premiumCount = ToppingsTwo?.length || 0;
    const regularCount = ToppingsOne?.length || 0;
    const indianCount  = ToppingsFree?.length || 0;

    // Close on escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Robust iOS-compatible body scroll lock (position:fixed trick)
    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    const tabs = [
        { key: "two",  label: nonRegularTitle, count: premiumCount },
        { key: "one",  label: regularTitle,    count: regularCount },
        { key: "free", label: indianStyleTitle,  count: indianCount  },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="topping-sheet-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Sheet */}
            <div
                ref={sheetRef}
                className="topping-sheet slide-up-in"
                role="dialog"
                aria-modal="true"
                aria-label="Select Toppings"
            >
                {/* Handle bar for mobile drag hint */}
                <div className="topping-sheet__handle" />

                {/* Header */}
                <div className="topping-sheet__header">
                    <div>
                        <p className="topping-sheet__title">Choose Toppings</p>
                        <p className="topping-sheet__subtitle">
                            Select from the categories below
                        </p>
                    </div>
                    <button
                        className="topping-sheet__close"
                        onClick={onClose}
                        aria-label="Close toppings"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="topping-sheet__tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`topping-sheet__tab ${activeTab === tab.key ? "topping-sheet__tab--active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    className="topping-sheet__tab-badge"
                                    style={{
                                        marginLeft: '6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '20px',
                                        height: '20px',
                                        padding: '0 5px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.35)',
                                        fontSize: '0.72rem',
                                        fontWeight: '700',
                                        lineHeight: '1',
                                        flexShrink: 0,
                                    }}
                                >{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab hint */}
                <p className="topping-sheet__hint">
                    {activeTab === "two" && "Each premium topping counts as 2 toppings."}
                    {activeTab === "one" && "Each regular topping counts as 1 topping."}
                    {activeTab === "free" && "Indian style toppings included at no extra charge."}
                </p>

                {/* Topping grid */}
                <div className="topping-sheet__body">
                    {activeTab === "two" && (
                        <div className="topping-sheet__list">
                            {Ingredients?.toppings?.countAsTwo?.map((data, index) => (
                                <ToppingTwoSelector
                                    key={index}
                                    data={data}
                                    ToppingsTwo={ToppingsTwo}
                                    DefaultToppingsTwo={DefaultToppingsTwo}
                                    handleTopping={(payload) => handleToppingsTwo(payload)}
                                    handleSizeChange={(payload) => handleSizeChange(payload)}
                                />
                            ))}
                            {!Ingredients?.toppings?.countAsTwo?.length && (
                                <p className="text-secondary text-center w-100 py-4">No premium toppings available.</p>
                            )}
                        </div>
                    )}
                    {activeTab === "one" && (
                        <div className="topping-sheet__list">
                            {Ingredients?.toppings?.countAsOne?.map((data, index) => (
                                <ToppingOneSelector
                                    key={index}
                                    data={data}
                                    ToppingsOne={ToppingsOne}
                                    DefaultToppingsOne={DefaultToppingsOne}
                                    handleTopping={(payload) => handleToppingOne(payload)}
                                    handleSizeChange={(payload) => handleSizeChange(payload)}
                                />
                            ))}
                            {!Ingredients?.toppings?.countAsOne?.length && (
                                <p className="text-secondary text-center w-100 py-4">No regular toppings available.</p>
                            )}
                        </div>
                    )}
                    {activeTab === "free" && (
                        <div className="topping-sheet__list">
                            {Ingredients?.toppings?.freeToppings?.map((data, index) => (
                                <FreeToppingSelector
                                    key={index}
                                    data={data}
                                    ToppingsFree={ToppingsFree}
                                    handleTopping={(payload) => handleFreeToppings(payload)}
                                    handleSizeChange={(payload) => handleSizeChange(payload)}
                                />
                            ))}
                            {!Ingredients?.toppings?.freeToppings?.length && (
                                <p className="text-secondary text-center w-100 py-4">No Indian style toppings available.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Done button */}
                <div className="topping-sheet__footer">
                    <button className="topping-sheet__done" onClick={onClose}>
                        ✓ Done — {premiumCount + regularCount + indianCount} topping{(premiumCount + regularCount + indianCount) !== 1 ? "s" : ""} selected
                    </button>
                </div>
            </div>
        </>
    );
};

export default ToppingSheet;
