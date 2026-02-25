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
        <div className="mt-4">
            <div className="topping-header-bar" onClick={() => toggleAccordion('sides')}>
                <span>SIDES</span>
                <span className={`fa ${activeAccordion === 'sides' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
            </div>

            <div className={`mt-2 ${activeAccordion === 'sides' ? 'd-block' : 'd-none'}`}>
                <div className="accordion-body px-0 py-2">
                    {specialOfferData?.freesides?.map((data, index) => (
                        <SidesSelector
                            key={`${index}-${data?.code}`}
                            Sides={Sides[0]}
                            setSides={setSides}
                            data={data}
                            handleSides={handleSides}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SidesConfig;
