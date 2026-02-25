import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const CrustSelector = ({ data, selectedCrust, handleCrust }) => {
    const itemID = data?.code || data?.crustCode || data?.crustName || data?.name || data?.sideName || data?.pizza_crust_name || "";
    const isSelected = !!selectedCrust && selectedCrust === itemID;
    const displayName = data.crustName || data.name || data.sideName || data.pizza_crust_name || "Regular Crust";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleCrust(itemID)}
        >
            <span>{displayName}</span>
            <span className="price-tag ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};