import React from "react";

const SizeSelector = ({ pizzaPrices = [], selectedSize, onSelectSize }) => {
    const handleChange = (e, size) => {
        e.preventDefault();
        onSelectSize(size);
    };

    return (
        <div className="mb-3">
            <div className="offer-section-label">SELECT SIZE</div>
            <div className="size-pill-scroll">
                {pizzaPrices?.map((size, index) => {
                    const active = selectedSize !== null ? selectedSize?.size === size?.size : false;
                    return (
                        <button
                            key={`size-${index}`}
                            type="button"
                            className={`size-pill ${active ? 'size-pill--active' : ''}`}
                            onClick={(e) => handleChange(e, size)}
                        >
                            <span className="size-pill__name">{size?.size}</span>
                            <span className="size-pill__price">${Number(size?.price ?? 0).toFixed(2)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SizeSelector;