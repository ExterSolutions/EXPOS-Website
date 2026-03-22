
export const CheeseSelector = ({ data, Cheese, handleCheese }) => {
    const isSelected = Cheese === data?.cheeseCode;
    return (
        <button
            type="button"
            className={`cust-pill-btn ${isSelected ? 'cust-pill-btn--active' : ''}`}
            onClick={() => handleCheese(data?.cheeseCode)}
        >
            {isSelected && <i className="bi bi-check2 me-1" />}
            {data?.cheeseName}
            {data?.price !== null && data?.price != 0 && <span className="cust-pill-price"> +${data?.price}</span>}
        </button>
    );
}