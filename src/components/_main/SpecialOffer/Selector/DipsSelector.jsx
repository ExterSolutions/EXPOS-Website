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
            className={`${isSelected ? 'active' : ''} py-3 px-3 mb-3 rounded-3`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
                if (e.target.tagName !== 'BUTTON') {
                    handleDips(data.dipsCode, quantity);
                }
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="radio"
                            className="form-check-input"
                            checked={isSelected}
                            readOnly
                        />
                        <p className="fs-6 mb-0">{data?.dipsName} ($ {data?.price})</p>
                    </div>
                    <div className="mt-3 px-3 d-flex align-items-center gap-2">
                        <button
                            disabled={isSelected ? quantity <= 1 : true}
                            onClick={() => handleQuantityChange(-1)}
                            className={`${isSelected ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 w-2`}
                        >
                            -
                        </button>
                        <p>{quantity}</p>
                        <button
                            disabled={isSelected ? quantity >= 10 : true}
                            onClick={() => handleQuantityChange(1)}
                            className={`${isSelected ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 fs-6 w-1`}
                        >
                            +
                        </button>
                    </div>
                </div>
                <IoMdCheckmarkCircleOutline
                    color={isSelected ? '#90EE90' : 'transparent'}
                    size={25}
                />
            </div>
        </div>
    );
}

export default DipsSelector;
