

export const SauceSelector = ({ data, Sauce, handleSauce }) => {
    return (
        <div className={`theme-border ${Sauce === data?.sauceCode ? 'active' : ''}`} onClick={() => handleSauce(data?.sauceCode)}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {Sauce === data?.sauceCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div className="">{`${data?.sauce}${data?.price !== null ? ` ($ ${data?.price})` : ""}`}</div>
                </div>

            </div>
        </div>
    )
}