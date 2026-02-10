import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function SidesSelector({ data, Sides, handleSides }) {
    const isSelected = Sides?.sideCode === data?.code;

    const handleClick = () => {
        handleSides(data.code);
    };

    return (
        <div
            className={`${isSelected ? 'active' : ''}  py-3 px-3 mb-3 rounded-3`}
            style={{ cursor: "pointer" }}
            onClick={handleClick}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="radio"
                            className="form-check-input"
                            checked={isSelected}
                            readOnly
                        />
                        <p className="fs-6 mb-0">{data?.sideName}</p>
                    </div>
                    <div className="mt-3 px-3">
                        <select
                            className="px-2 outline-none rounded-1"
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
                <IoMdCheckmarkCircleOutline
                    color={isSelected ? "#90EE90" : "transparent"}
                    size={25}
                />
            </div>
        </div>
    );
}

export default SidesSelector;
