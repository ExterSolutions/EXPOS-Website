
export const CustomizeDrinksSelector = ({ data, selectedDrinksType, handleDrinksType }) => {
    const isSelected = selectedDrinksType === data;
    return (
        <div
            className={`theme-border ${isSelected ? "active" : ""}`}
            onClick={() => handleDrinksType(data)}
        >
            <div className="d-flex align-items-center gap-2">
                {isSelected ? (
                    <i className="bi bi-check-circle-fill" />
                ) : (
                    <i className="bi bi-plus-circle" />
                )}
                <span className="fw-medium">{data}</span>
            </div>
        </div>
    );
};
