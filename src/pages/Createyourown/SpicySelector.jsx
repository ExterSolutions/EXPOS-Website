

export const SpicySelector = ({ data, Spicy, handleSpicy }) => {
    const isSelected = Spicy === data?.spicyCode;
    return (
        <div
            className={`theme-border ${isSelected ? "active" : ""}`}
            onClick={() => handleSpicy(data?.spicyCode)}
        >
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {Spicy === data?.spicyCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div className="">{`${data?.spicy}${data?.price !== null ? ` ($ ${data?.price})` : ""}`}</div>
                </div>
            </div>
        </div>
    )
}