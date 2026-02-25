import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const CookSelector = ({ data, selectedCook, handleCook }) => {
    const code = data.cookCode || data.code;
    const isSelected = selectedCook === code;
    const displayName = data.cook || data.name || data.label || data.sideName || "Normal Cook";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleCook(code)}
        >
            <span>{displayName}</span>
            <span className="price-tag ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};