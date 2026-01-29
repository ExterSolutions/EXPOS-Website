import React from 'react'
import { FaChevronLeft } from 'react-icons/fa';

const FixedCartSection = ({ ...props }) => {

    const {
        onAddToCart,
        totalPrice,
        quantity,
        section,
    } = props;

    return (
        <div className="fixed-cart-bottom-section d-block d-md-none">
            <div className="row gx-3 justify-content-between align-items-center">
                <div className="col-5 responsive-card-text-color">
                    <FaChevronLeft size={20} />
                    <span className="mx-2">
                        <strong>${(parseFloat(totalPrice) * quantity).toFixed(2)}</strong>
                    </span>
                </div>
                <div className="col-auto text-nowrap text-center">
                    <button
                        type="button"
                        className="top-0 pizza-card-btn-background-color pizza-card-btn-text-color pizza-card-btn-text-color btn btn-sm px-3 py-2"
                        onClick={onAddToCart}
                    >
                        <b>{section}</b>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FixedCartSection