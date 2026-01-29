import React from 'react';
import DipsSelector from '../Selector/DipsSelector';

function DipsConfig({ Dips, setDips, dipsData, activeAccordion, toggleAccordion }) {
    const handleDips = (code, selectedQuantity) => {
        const isSelected = Dips?.some((dips) => dips?.dipsCode === code);
        const selectedDip = dipsData?.find((dips) => dips?.dipsCode === code);

        if (!selectedDip) return;

        if (!isSelected) {
            const payload = {
                dipsCode: selectedDip.dipsCode,
                dipsName: selectedDip.dipsName,
                dipsPrice: Number(selectedDip.price),
                quantity: Number(selectedQuantity),
                totalPrice: Number(selectedDip?.price) * Number(selectedQuantity),
            };
            setDips((prev) => [...prev, payload]);
        } else {
            setDips((prev) => prev.filter((dips) => dips?.dipsCode !== code));
        }
    };


    const handleDipsQuantity = (payload) => {
        const updatedDips = Dips?.map((item) =>
            item.dipsCode === payload.dipsCode ? payload : item
        );
        setDips(updatedDips);
    };

    return (
        <div className="mt-3">
            <div className="accordion" id="accordionExample1">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                            className={`fw-bold fs-6 accordion-button ${activeAccordion === 'dips' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => toggleAccordion('dips')}
                            aria-expanded={activeAccordion === 'dips' ? 'true' : 'false'}
                            aria-controls="collapseOne"
                        >
                            DIPS
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        className={`accordion-collapse collapse ${activeAccordion === 'dips' ? 'show' : ''}`}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample1"
                    >
                        <div className="accordion-body primary-background-color">
                            {dipsData?.map((data) => (
                                <DipsSelector
                                    key={data?.dipsCode}
                                    Dips={Dips}
                                    data={data}
                                    handleDips={handleDips}
                                    handleDipsQuantity={handleDipsQuantity}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DipsConfig;
