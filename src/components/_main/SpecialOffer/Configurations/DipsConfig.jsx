import React from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
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
                <span>Choose Your Dips (Free limit: 2)</span>
                {activeAccordion === 'dips' ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            <div className={`${activeAccordion === 'dips' ? 'd-block' : 'd-none'} dips-container`}>
                <div className="accordion-body px-0 py-0">
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
