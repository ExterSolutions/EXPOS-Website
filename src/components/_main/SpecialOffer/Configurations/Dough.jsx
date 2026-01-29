import React from 'react'
import SpecialCrust from './Dough/Crust';
import SpecialCrustType from './Dough/CrustType';
import SpecialSpecialBases from './SpecialBases';

function SpecialDough({ count, pizzaState, setPizzaState, specialOfferData, activeAccordion, toggleAccordion }) {
    return (
        <>
            {/* dough */}
            <div className="mt-3">
                <div className="accordion" id="accordionExample4">
                    <div className="accordion-item sub-accordion">
                        <h5 className="accordion-header" id=" headingFour">
                            <button
                                className={`fw-bold accordion-button ${activeAccordion === `dough${count}` ? '' : 'collapsed'}`}
                                type="button"
                                onClick={() => toggleAccordion(`dough${count}`)}
                                aria-expanded={activeAccordion === `dough${count}` ? 'true' : 'false'}
                                aria-controls="collapseFour"
                            >
                                DOUGH
                            </button>
                        </h5>
                        <div
                            id="collapseFour"
                            className={`accordion-collapse collapse ${activeAccordion === `dough${count}` ? 'show' : ''}`}
                            aria-labelledby="headingFour"
                            data-bs-parent="#accordionExample4"
                            style={{ overflow: "hidden" }}
                        >
                            <div className="accordion-body primary-background-color">
                                <SpecialCrust count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
                                <SpecialCrustType count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
                                <SpecialSpecialBases count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SpecialDough