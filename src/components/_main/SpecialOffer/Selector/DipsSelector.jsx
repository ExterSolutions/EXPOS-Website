import React, { useEffect, useState } from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function DipsSelector({ data, Dips, handleDips, handleDipsQuantity }) {
    const isSelected = Dips?.some((item) => item.dipsCode === data?.dipsCode);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(Dips?.find(item => item.dipsCode === data?.dipsCode)?.quantity || quantity);
    }, [])

    // 
    const handleQuantityChange = (delta) => {
        if (isSelected) {
            const newQuantity = quantity + delta;
            if (newQuantity < 1) return;
            setQuantity(newQuantity);
            const payload = {
                dipsCode: data.dipsCode,
                dipsName: data.dipsName,
                quantity: Number(newQuantity),
                dipsPrice: Number(data?.price),
                totalPrice: Number(data?.price) * Number(newQuantity),
            };
            handleDipsQuantity(payload);
        } else {
            setQuantity(quantity + delta);
        }
    };

    useEffect(() => {
        if (!isSelected) {
            setQuantity(1);
        }
    }, [isSelected])


    return (
        <div
            className={`topping-item ${isSelected ? 'active' : ''} mb-3`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
                if (e.target.tagName !== 'BUTTON' && e.target.closest('.quantity-controls') === null) {
                    handleDips(data.dipsCode, quantity);
                }
            }}
        >
            <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center">
                    <span className={`topping-radio-circle ${isSelected ? 'checked' : ''}`}></span>
                    <span className="topping-item-name">{data?.dipsName} ($ {data?.price})</span>
                </div>
                {isSelected && <IoMdCheckmarkCircleOutline className="topping-check-icon" />}
            </div>

            <div className="mt-3 pl-4 ml-4 quantity-controls d-flex align-items-center gap-2">
                <button
                    disabled={isSelected ? quantity <= 1 : true}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(-1);
                    }}
                    className={`${isSelected ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 w-2`}
                >
                    -
                </button>
                <p className="mb-0">{quantity}</p>
                <button
                    disabled={isSelected ? quantity >= 10 : true}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(1);
                    }}
                    className={`${isSelected ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 fs-6 w-1`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default DipsSelector;
