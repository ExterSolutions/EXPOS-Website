import React from "react";

/**
 * SizeSelector — pill-button style, consistent with Signature & Other Pizza.
 * Replaces the old accordion/dropdown component.
 */
const SizeSelector = ({ pizzaPrices = [], selectedSize, onSelectSize }) => {
    return (
        <div className="mb-3">
            <p
                className="fw-bold text-uppercase mb-2"
                style={{ fontSize: "0.8rem", letterSpacing: "0.06em", opacity: 0.7 }}
            >
                Select Size
            </p>
            <div className="size-pill-scroll">
                {pizzaPrices?.map((sizeObj, index) => {
                    const isActive = selectedSize != null
                        ? selectedSize?.size === sizeObj?.size
                        : false;
                    return (
                        <button
                            key={index}
                            type="button"
                            className={`size-pill${isActive ? " size-pill--active" : ""}`}
                            onClick={() => onSelectSize(sizeObj)}
                        >
                            <span className="size-pill__label">{sizeObj?.size}</span>
                            {sizeObj?.price != null && (
                                <span className="size-pill__price">
                                    ${Number(sizeObj.price).toFixed(2)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SizeSelector;