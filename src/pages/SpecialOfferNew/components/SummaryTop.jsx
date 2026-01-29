import React from 'react'
import fallbackImage from "../../../assets/images/default-pizza.jpg";
import { FaEye, FaMinus, FaPlus } from 'react-icons/fa';

const SummaryTop = ({ ...props }) => {
    const {
        offerData,
        onAddToCart,
        totalPrice,
        quantity,
        setQuantity,
        isEditMode = false, // New prop to determine mode
        handleOpenSummaryPopup
    } = props;
    const buttonText = isEditMode ? "Update Cart" : "Add to Cart";
    return (
        <div>
            <h5 className="fw-bold mb-3">{offerData?.name}</h5>
            <div className="p-3 card-background-color">
                <div className="card-body">
                    <div className="row justify-content-start align-content-center">
                        <div className="col-auto">
                            <img
                                className="pizzaImageBorderSM"
                                src={offerData?.image}
                                alt={offerData?.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImage;
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <div className="d-flex flex-column justify-content-center">
                                <div className=" fw-bold text-start my-1 pizzaPriceSm">
                                    ${(parseFloat(totalPrice) * quantity).toFixed(2)}
                                </div>
                                <div
                                    className="d-flex justify-content-start align-items-center my-1"
                                    style={{ userSelect: "none" }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-secondary rounded-circle pizzaQtyButton"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <FaMinus className="pizzaQtyButtonSpan" />
                                    </button>
                                    <div className="fs-4 fw-bold mx-2 px-4">
                                        {quantity}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary rounded-circle pizzaQtyButton"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={quantity >= 10}
                                    >
                                        <FaPlus className="pizzaQtyButtonSpan" />
                                    </button>
                                </div>
                                <div className="d-flex flex-row justify-content-start">
                                    <div className="d-flex me-2 justify-content-start py-2">
                                        <button
                                            type="button"
                                            className={`view-button px-3`}
                                            onClick={onAddToCart}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-start py-2">
                                        <button
                                            type='button'
                                            onClick={handleOpenSummaryPopup}
                                            className="btn btn-sm view-button"
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryTop