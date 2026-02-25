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
        <div className="mt-4">
            <div className="topping-header-bar" onClick={() => toggleAccordion('dips')}>
                <span>DIPS</span>
                <span className={`fa ${activeAccordion === 'dips' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
            </div>

            <div className={`mt-2 ${activeAccordion === 'dips' ? 'd-block' : 'd-none'}`}>
                <div className="accordion-body px-0 py-2">
                    {dipsData?.map((data, index) => (
                        <DipsSelector
                            key={`${index}-${data?.dipsCode}`}
                            Dips={Dips}
                            data={data}
                            handleDips={handleDips}
                            handleDipsQuantity={handleDipsQuantity}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DipsConfig;
