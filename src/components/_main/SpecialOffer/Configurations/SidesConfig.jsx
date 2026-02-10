import React from 'react';
import SidesSelector from '../Selector/SidesSelector';

function SidesConfig({ Sides, setSides, specialOfferData, activeAccordion, toggleAccordion }) {
    const handleSides = (code) => {
        const selected = specialOfferData?.freesides?.find((side) => side?.code === code);
        if (selected) {
            const payload = {
                sideCode: selected?.code,
                sideName: selected?.sideName,
                sideType: selected?.type,
                lineCode: selected?.lineEntries[0]?.code,
                sidePrice: selected?.lineEntries[0]?.price,
                sideSize: selected?.lineEntries[0]?.size,
                quantity: 1,
                totalPrice: Number(0.0).toFixed(2),
            }
            setSides([payload]);
        }
    };

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample1">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                            className={`fw-bold fs-6 accordion-button ${activeAccordion === 'sides' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => toggleAccordion('sides')}
                            aria-expanded={activeAccordion === 'sides' ? 'true' : 'false'}
                            aria-controls="collapseOne"
                        >
                            SIDES
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className={`accordion-collapse collapse ${activeAccordion === 'sides' ? 'show' : ''}`}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample1"
                        style={{ overflow: "hidden" }}
                    >
                        <div className="accordion-body primary-background-color">
                            {specialOfferData?.freesides?.map((data) => (
                                <SidesSelector
                                    key={data?.code}
                                    Sides={Sides[0]}
                                    setSides={setSides}
                                    data={data}
                                    handleSides={handleSides}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidesConfig;
