

export const CrustTypeSelector = ({ data, CrustType, handleCrustType }) => {
    return (
        <div
            className={`theme-border ${CrustType === data?.crustTypeCode ? 'active' : ''}`}
            onClick={() => handleCrustType(data?.crustTypeCode)}
        >
            <div className="d-flex align-items-center gap-2">
                {CrustType === data?.crustTypeCode ? (
                    <i className="bi bi-check-circle-fill" />
                ) : (
                    <i className="bi bi-plus-circle" />
                )}
                <div className="">{`${data?.crustType}${data?.price !== null ? ` ($ ${data?.price})` : ""}`}</div>
            </div>

        </div>
    )
}