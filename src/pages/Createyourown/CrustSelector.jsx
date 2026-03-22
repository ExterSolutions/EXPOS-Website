
export const CrustSelector = ({ data, Crust, handleCrust }) => {
    const isSelected = Crust === data?.crustCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleCrust(data?.crustCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.crustName}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}