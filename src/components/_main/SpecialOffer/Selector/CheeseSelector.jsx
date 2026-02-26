import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const CheeseSelector = ({ data, selectedCheese, handleCheese }) => {
    const itemID = data?.code || data?.cheeseCode || data?.cheeseName || data?.name || data?.sideName || data?.pizza_cheese_name || "";
    const isSelected = !!selectedCheese && selectedCheese === itemID;
    const displayName = data.cheeseName || data.name || data.sideName || data.pizza_cheese_name || "Normal Cheese";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleCheese(itemID)}
        >
            <span>{displayName}</span>
            <span className=" ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};