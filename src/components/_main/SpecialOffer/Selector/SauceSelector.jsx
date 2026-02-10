import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const SauceSelector = ({ data, selectedSauce, handleSauce }) => {
    const isSelected = selectedSauce === data.sauceCode;
    const containerStyle = {
        cursor: 'pointer',
    };

    return (
        <div
            className={`${isSelected ? 'active' : ''}  py-3 px-3 mb-3 rounded-3`}
            style={containerStyle}
            onClick={() => handleSauce(data.sauceCode)}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="radio"
                        className="form-check-input"
                        checked={isSelected}
                        readOnly
                    />
                    <p className="fs-6">
                        {`${data.sauce} ($${data.price})`}
                    </p>
                </div>
                <IoMdCheckmarkCircleOutline
                    color={isSelected ? '#90EE90' : 'transparent'}
                    size={25}
                />
            </div>
        </div>
    );
};