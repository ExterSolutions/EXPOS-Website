import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function SidesSelector({ data, Sides, handleSides }) {
    const isSelected = Sides?.sideCode === data?.code;

    const handleClick = () => {
        handleSides(data.code);
    };

    return (
        <div
            className={`topping-item ${isSelected ? 'active' : ''} mb-3`}
            style={{ cursor: "pointer" }}
            onClick={handleClick}
        >
            <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center">
                    <span className={`topping-radio-circle ${isSelected ? 'checked' : ''}`}></span>
                    <span className="topping-item-name">{data?.sideName}</span>
                </div>
                {isSelected && <IoMdCheckmarkCircleOutline className="topping-check-icon" />}
            </div>
            <div className="mt-2 pl-4 ml-4">
                <select
                    className="topping-select"
                    value={Sides?.lineEntries?.[0]?.code || ''}
                    disabled
                >
                    {data?.lineEntries?.map((comb) => (
                        <option key={comb.code} value={comb.code}>
                            {`${comb.size}`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SidesSelector;
