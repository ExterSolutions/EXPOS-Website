
export const SpicySelector = ({ data, Spicy, handleSpicy }) => {
    const isSelected = Spicy === data?.spicyCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleSpicy(data?.spicyCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.spicy}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}