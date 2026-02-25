import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function DrinksSelector({ data, Drinks, handleDrinks }) {
    const isSelected = Drinks?.drinksCode === data?.code;

    const handleClick = () => {
        handleDrinks(data.code);
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
                    <span className="topping-item-name">{data?.softDrinkName} ($ 0)</span>
                </div>
                {isSelected && <IoMdCheckmarkCircleOutline className="topping-check-icon" />}
            </div>
        </div>
    );
}

export default DrinksSelector