

export const CrustSelector = ({ data, Crust, handleCrust }) => {
    return (
        <div className={`theme-border ${Crust === data?.crustCode ? 'active' : ''}`} onClick={() => handleCrust(data?.crustCode)}>
            <div className="d-flex align-items-center gap-2">
                {Crust === data?.crustCode ? (
                    <i className="bi bi-check-circle-fill" />
                ) : (
                    <i className="bi bi-plus-circle" />
                )}
                <div className="">{`${data?.crustName} ($ ${data?.price})`}</div>
            </div>
        </div>
    )
}