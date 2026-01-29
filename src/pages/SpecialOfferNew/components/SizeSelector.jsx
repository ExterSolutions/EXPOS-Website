import React, { useState } from "react";
import { IoMdReturnLeft } from "react-icons/io";

const SizeSelector = ({ pizzaPrices = [], selectedSize, onSelectSize }) => {
    const [isOpen, setIsOpen] = useState(true);

    const accordionId = `size-accordion`;
    const headerId = `size-header`;

    const handleChange = (e, size) => {
        e.preventDefault();
        onSelectSize(size);
    };

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-3">
            <div className="accordion" id={accordionId}>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={headerId}>
                        <button
                            className={`fw-bold fs-6 accordion-button ${isOpen ? "" : "collapsed"}`}
                            type="button"
                            onClick={toggleAccordion}
                            aria-expanded={isOpen ? "true" : "false"}
                            aria-controls="collapseOne"
                        >
                            SELECT SIZE
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                        aria-labelledby={headerId}
                        data-bs-parent={`#${accordionId}`}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="accordion-body primary-background-color">

                            <div className="size-grid">
                                {pizzaPrices?.map((size, index) => {
                                    const active = selectedSize !== null ? selectedSize?.size === size?.size : false;
                                    return (
                                        <div
                                            className={`py-2 px-3 rounded-3 ${active
                                                ? "selected-card-background-color selected-card-text-color"
                                                : "card-background-color card-text-color"
                                                }`}
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleChange(e, size)}
                                            key={`size-${index}`}
                                        >
                                            <div className="">
                                                <div className="d-block">
                                                    {size?.size} (${Number(size?.price ?? 0).toFixed(2)})
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeSelector;