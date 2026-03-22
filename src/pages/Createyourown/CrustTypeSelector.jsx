
export const CrustTypeSelector = ({ data, CrustType, handleCrustType }) => {
    const isSelected = CrustType === data?.crustTypeCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleCrustType(data?.crustTypeCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.crustType}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}