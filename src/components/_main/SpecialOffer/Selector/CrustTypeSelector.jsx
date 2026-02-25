import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const CrustTypeSelector = ({ data, selectedCrustType, handleCrustType }) => {
    const itemID = data?.code || data?.crustTypeCode || data?.crustType || data?.name || data?.label || "";
    const isSelected = !!selectedCrustType && selectedCrustType === itemID;
    const displayName = data.crustType || data.name || data.label || data.sideName || data.type || "Regular";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleCrustType(itemID)}
        >
            <span>{displayName}</span>
            <span className="price-tag ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};