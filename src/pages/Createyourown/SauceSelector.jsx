
export const SauceSelector = ({ data, Sauce, handleSauce }) => {
    const isSelected = Sauce === data?.sauceCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleSauce(data?.sauceCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.sauce}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}