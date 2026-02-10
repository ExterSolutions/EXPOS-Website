import React from 'react'
import { Modal } from 'react-bootstrap';

const SummaryModal = ({ ...props }) => {
    const {
        selectedSize,
        pizzaSelections,
        selectedSide,
        selectedDips,
        selectedDrink,
        modalState,
        toggleSummaryModal,
    } = props;

    return (
        <Modal
            show={modalState}
            onHide={toggleSummaryModal}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className="primary-background-color">
                <div>
                    Details
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 scrollable-content" >
                        {selectedSize && (
                            <div className="mb-1">
                                <div className="d-flex gap-2 pt-1">
                                    <strong className="text-muted">Size :</strong>
                                    <span className="fw-medium">{selectedSize.size}</span>
                                </div>
                            </div>
                        )}

                        {/* Pizza Selections */}
                        {pizzaSelections && pizzaSelections.length > 0 &&
                            pizzaSelections.map((pizza, idx) => {

                                // Collect all toppings into one array
                                const allToppings = [
                                    ...(pizza.toppings?.countAsTwoToppings || []),
                                    ...(pizza.toppings?.countAsOneToppings || []),
                                    ...(pizza.toppings?.freeToppings || [])
                                ];
                                if (pizza?.signaturePizzaCode === undefined && pizza?.signaturePizzaCode === null && pizza?.signaturePizzaCode === "") {
                                    return <></>
                                }

                                return (
                                    <div className="my-2 theme-top-border" key={idx}>
                                        <div className="d-flex gap-2 mb-1 pt-1">
                                            <strong className="text-muted">Pizza :</strong>
                                            <span className="fw-medium">{pizza.signaturePizzaName || "Not Selected"}</span>
                                        </div>

                                        <div className="d-flex flex-row gap-1">
                                            <div className="flex-fill">
                                                <div className="small">
                                                    <span>
                                                        Cheese:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.cheese?.cheeseName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>Crust:</span>
                                                    <span className="ms-2 fw-medium">{pizza?.crust?.crustName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>
                                                        Crust Type:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.crustType?.crustType}</span>
                                                </div>
                                                <div className="small">
                                                    <span>
                                                        Special Base:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.specialBases?.specialbaseName}</span>
                                                </div>
                                                <div className="small">
                                                    <span>
                                                        Sauce:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.sauce?.sauce}</span>
                                                </div>
                                                <div className="small">
                                                    <span>
                                                        Cook:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.cook?.cook}</span>
                                                </div>
                                                <div className="small">
                                                    <span>
                                                        Spicy:
                                                    </span>
                                                    <span className="ms-2 fw-medium">{pizza?.spicy?.spicy}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {allToppings.length > 0 && (
                                            <div className="d-flex flex-column gap-1">
                                                <div className="text-muted small">Toppings:</div>
                                                <div className="fw-medium d-flex flex-wrap gap-1">
                                                    {allToppings.map((topping, tIdx) => (
                                                        <span key={tIdx} className="topping-badge">
                                                            {topping.toppingsName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }

                        {/* Selected Side */}
                        {selectedSide && Object.keys(selectedSide).length > 0 && (
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
                        {selectedDrink && Object.keys(selectedDrink).length > 0 && (
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
            </Modal.Body>
            <Modal.Footer className="primary-background-color">
                <button
                    type="button"
                    className="btn btn-danger rounded-3"
                    onClick={toggleSummaryModal}
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default SummaryModal