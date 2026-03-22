
export const SpecialBasesSelector = ({ data, SpecialBases, handleSpecialBases }) => {
    const isSelected = SpecialBases === data?.specialbaseCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleSpecialBases(isSelected ? '' : data?.specialbaseCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.specialbaseName}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}