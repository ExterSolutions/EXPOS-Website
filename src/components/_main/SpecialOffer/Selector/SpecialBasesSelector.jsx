import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const SpecialBasesSelector = ({ data, selectedSpecialBases, handleSpecialBases }) => {
    const itemID = data?.code || data?.specialBasesCode || data?.specialbaseCode || data?.specialbaseName || data?.name || data?.specialBases || "";
    const isSelected = !!selectedSpecialBases && selectedSpecialBases === itemID;
    const displayName = data.specialbaseName || data.name || data.specialBases || data.sideName || "None";

    return (
        <div
            className={`theme-pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => handleSpecialBases(itemID)}
        >
            <span>{displayName}</span>
            <span className=" ms-1">(${parseFloat(data.price || 0).toFixed(2)})</span>
        </div>
    );
};