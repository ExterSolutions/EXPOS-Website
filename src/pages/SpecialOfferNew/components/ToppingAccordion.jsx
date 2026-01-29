import { useState } from "react";

const ToppingAccordion = ({ index, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const accordionId = `pizza-according-${index}`;
    const collapseId = `accordion-collapse-${index}`;
    const headerId = `topping-header-${index}`;

    return (
        <div className="accordion mt-3" id={accordionId}>
            <div className="accordion-item">
                <h2 className="accordion-header" id={headerId}>
                    <button
                        className={`accordion-button fw-bold  ${isOpen ? "" : "collapsed"}`}
                        type="button"
                        data-bs-target={`#collapse-${accordionId}`}
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Toppings
                    </button>
                </h2>
                <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                    aria-labelledby={headerId}
                    data-bs-parent={`#${accordionId}`}
                >
                    <div className="accordion-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToppingAccordion;
