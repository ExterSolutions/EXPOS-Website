

export const CookSelector = ({ data, Cook, handleCook }) => {
    return (
        <div className={`theme-border ${Cook === data?.cookCode ? 'active' : ''}`} onClick={() => handleCook(data?.cookCode)}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {Cook === data?.cookCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div className="">{`${data?.cook}${data?.price !== null ? ` ($ ${data?.price})` : ""}`}</div>
                </div>
            </div>
        </div>
    )
}