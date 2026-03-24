import React from "react";
import fallbackImage from "../../../assets/images/default-pizza.jpg";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa";

const SummarySidebar = ({ ...props }) => {
    const {
        selectedSize,
        offerData,
        pizzaSelections,
        selectedSide,
        selectedDips,
        selectedDrink,
        onAddToCart,
        totalPrice,
        quantity,
        setQuantity,
        isEditMode = false,
        handleOpenSummaryPopup
    } = props;

    const buttonText = isEditMode ? "Update Cart" : "Add to Cart";

    return (
        <div className="right-side-div sticky-top">
            <div className="p-2 right-side-internal-div-new bg-white shadow-sm rounded-4 card-text-color" style={{ border: '1px solid var(--primary-light)' }}>
                <div className="px-2 row g-1">
                    <div className="col-lg-5 p-2 rounded-3">
                        <img
                            className="pizzaImageBorder"
                            src={offerData?.image}
                            alt="pizza-icon"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImage;
                            }}
                        />
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-lg-6">
                        <div className="d-flex flex-column align-items-center gap-3 py-3">
                            <div className="lh-sm fs-1 fw-bold text-center">
                                ${(parseFloat(totalPrice) * quantity).toFixed(2)}
                            </div>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded-circle pizzaQtyButton"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <FaMinus className="pizzaQtyButtonSpan" />
                                </button>
                                <div className="fs-4 fw-bold mx-2">
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
                            {/* Action Button */}
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="view-button px-3"
                                    onClick={onAddToCart}
                                >
                                    {buttonText}
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={handleOpenSummaryPopup}
                                    className="btn pizza-view-selection-btn-background-color pizza-card-btn-text-color fw-bold"
                                >
                                    <FaEye />
                                </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">

                        {/* Selected Size */}
                        {selectedSize && (
                            <div className="mb-1 theme-top-border">
                                <div className="d-flex gap-2 pt-1">
                                    <strong className="text-muted">Size :</strong>
                                    <span className="fw-medium">{selectedSize.size}</span>
                                </div>
                            </div>
                        )}

                        {/* Pizza Selections */}
                        {pizzaSelections && pizzaSelections.length > 0 &&
                            pizzaSelections.map((pizza, idx) => {

                                // Skip pizzas that haven't been selected yet
                                if (!pizza?.signaturePizzaCode || pizza?.signaturePizzaCode === "") {
                                    return null;
                                }

                                return (
                                    <div className="my-2 theme-top-border" key={`pizza-${idx}`}>
                                        <div className="d-flex gap-2 mb-1 pt-1">
                                            <strong className="text-muted">Pizza :</strong>
                                            <span className="fw-medium">{pizza.signaturePizzaName}</span>
                                        </div>

                                        <div className="d-flex flex-row gap-1">
                                            <div className="flex-fill">
                                                <div className="small">
                                                    <span>Cheese:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.cheese?.cheeseName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Dough:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.crust?.crustName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Crust Type:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.crustType?.crustType}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Special Base:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.specialBases?.specialbaseName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Sauce:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.sauce?.sauce}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Cook:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.cook?.cook}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Spicy:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.spicy?.spicy}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }

                        {/* Selected Side */}
                        {selectedSide && (Array.isArray(selectedSide) ? selectedSide.length > 0 : Object.keys(selectedSide).length > 0) && (
                            <div className="my-2 theme-top-border">
                                <div className="d-flex flex-row align-items-center gap-2 pt-1">
                                    <strong className="text-muted">Side:</strong>
                                    <span className="fw-medium small">
                                        {Array.isArray(selectedSide)
                                            ? selectedSide[0]?.sideName
                                            : selectedSide.sideName}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Selected Drink */}
                        {selectedDrink && (Array.isArray(selectedDrink) ? selectedDrink.length > 0 : Object.keys(selectedDrink).length > 0) && (
                            <div className="my-2 theme-top-border">
                                <div className="d-flex flex-row align-items-center gap-2 pt-1">
                                    <strong className="text-muted">Drink:</strong>
                                    <span className="fw-medium small">
                                        {Array.isArray(selectedDrink)
                                            ? selectedDrink[0]?.drinksName
                                            : selectedDrink.drinksName}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Selected Dips */}
                        {selectedDips && selectedDips.length > 0 && (
                            <div className="my-2 theme-top-border">
                                <div className="d-flex flex-row align-items-top gap-2 pt-1">
                                    <strong className="">Dips:</strong>
                                    <div className="fw-medium ms-1">
                                        {selectedDips.map((dip, idx) => (
                                            <div key={idx} className="small">
                                                {dip.dipsName} (x{dip.quantity})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySidebar;