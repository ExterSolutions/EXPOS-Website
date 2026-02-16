export const CheeseSelector = ({ data, Cheese, handleCheese }) => {
    return (
        // Added 'mb-2' for vertical spacing between boxes
        <div 
            className={`theme-border ${Cheese === data?.cheeseCode ? 'active' : ''} rounded-3 mb-2 p-2`} 
            onClick={() => handleCheese(data?.cheeseCode)}
            style={{ cursor: 'pointer' }} // Good practice for clickable items
        >
            <div className="d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-2">
                    {Cheese === data?.cheeseCode ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <div>{`${data?.cheeseName} ($ ${data?.price})`}</div>
                </div>
            </div>
        </div>
    )
}