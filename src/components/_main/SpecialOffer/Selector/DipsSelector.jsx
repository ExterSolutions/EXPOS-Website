import React from 'react';

function DipsSelector({ data, Dips, handleDips, handleDipsQuantity }) {
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
        <div className={`dip-item-card ${isSelected ? 'active' : ''}`}>
            <div className="d-flex flex-column">
                <div className="mb-2">
                    <span className="dip-name">{data?.dipsName}</span>
                    <span className="dip-price">${Number(data?.price).toFixed(2)}</span>
                </div>

                <div className="quantity-controls-wrap">
                    <button
                        className="quantity-btn-circle"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 0}
                    >
                        -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                        className="quantity-btn-circle"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DipsSelector;
