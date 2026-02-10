import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function DrinksSelector({ data, Drinks, handleDrinks }) {
    const isSelected = Drinks?.drinksCode === data?.code;

    const handleClick = () => {
        handleDrinks(data.code);
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
                        <p className="fs-6 mb-0">{data?.softDrinkName} ($ 0)</p>
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

export default DrinksSelector