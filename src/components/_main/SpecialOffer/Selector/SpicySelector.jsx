import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const SpicySelector = ({ data, selectedSpicy, handleSpicy }) => {
    const code = data.spicyCode || data.code;
    const isSelected = selectedSpicy === code;
    const displayName = data.spicy || data.name || data.label || data.sideName || "Normal";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleSpicy(code)}
        >
            <span>{displayName}</span>
            <span className=" ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};