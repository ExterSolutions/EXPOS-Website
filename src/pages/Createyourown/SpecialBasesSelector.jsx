

export const SpecialBasesSelector = ({ data, SpecialBases, handleSpecialBases }) => {
    return (
        // changes
        <div className={`theme-border ${SpecialBases === data?.specialbaseCode ? 'active' : ''}`} onClick={() => handleSpecialBases(SpecialBases === data?.specialbaseCode ? '' : data?.specialbaseCode)}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {SpecialBases === data?.specialbaseCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div className="">{`${data?.specialbaseName} ($ ${data?.price})`}</div>
                </div>
            </div>
        </div>
    )
}