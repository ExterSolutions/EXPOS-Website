

export const CheeseSelector = ({ data, Cheese, handleCheese }) => {
    return (
        <div className={`theme-border ${Cheese === data?.cheeseCode ? 'active' : ''}  rounded-3`} onClick={() => handleCheese(data?.cheeseCode)}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {Cheese === data?.cheeseCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div className="">{`${data?.cheeseName} ($ ${data?.price})`}</div>
                </div>
            </div>
        </div>
    )
}