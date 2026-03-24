import { IoCheckmarkCircle, IoAddCircleOutline } from "react-icons/io5";

export const CustomizeDrinksSelector = ({ data, selectedDrinksType, handleDrinksType }) => {
    const isSelected = selectedDrinksType === data;

    return (
        <div
            className={`drink-item ${isSelected ? 'drink-item--selected' : ''}`}
            onClick={() => handleDrinksType(data)}
        >
            {isSelected
                ? <IoCheckmarkCircle className="topping-item__check-icon" />
                : <IoAddCircleOutline className="topping-item__add-icon" />
            }
            <span className="drink-item__name">{data}</span>
        </div>
    );
};
