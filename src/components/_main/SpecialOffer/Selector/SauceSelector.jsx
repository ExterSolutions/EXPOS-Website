import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const SauceSelector = ({ data, selectedSauce, handleSauce }) => {
    const code = data.sauceCode || data.code;
    const isSelected = selectedSauce === code;
    const displayName = data.sauce || data.name || data.sideName || "Normal Sauce";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleSauce(code)}
        >
            <span>{displayName}</span>
            <span className="price-tag ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};