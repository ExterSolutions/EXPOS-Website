
function CustomPizzaCart({ data }) {
    // isEmptyObject
    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
    return (
        <>
            <h4 className="mb-1">
                Pizza
            </h4>
            {data?.crust && isEmptyObject(data?.crust) === false && (
                <div className="mb-1">
                    <p>Crust :</p>
                    <span>{data?.crust?.crustName}</span>
                </div>
            )}
            {data?.cheese && isEmptyObject(data?.cheese) === false && (
                <div className="mb-1">
                    <p>Cheese :</p>
                    <span>{data?.cheese?.cheeseName}</span>
                </div>
            )}
            {data?.specialBases &&
                isEmptyObject(data?.specialBases) === false && (
                    <div className="mb-1">
                        <p>Specialbases :</p>
                        <span>{data?.specialBases?.specialbaseName}</span>
                    </div>
                )}
            {data?.spicy && isEmptyObject(data?.spicy) === false && (
                <div className="mb-1">
                    <p>Spicy :</p>
                    <span>{data?.spicy?.spicy}</span>
                </div>
            )}
            {data?.sauce && isEmptyObject(data?.sauce) === false && (
                <div className="mb-1">
                    <p>Sauce :</p>
                    <span>{data?.sauce?.sauce}</span>
                </div>
            )}
            {data?.cook && isEmptyObject(data?.cook) === false && (
                <div className="mb-1">
                    <p>Cook :</p>
                    <span>{data?.cook?.cook}</span>
                </div>
            )}
            <div className="mb-1">
                {/* Count As Two */}
                {data?.toppings?.countAsTwoToppings.length > 0 && (
                    <div className="mb-1">
                        <p>Toppings (Count 2) : </p>
                        {data?.toppings?.countAsTwoToppings?.map((data, index) => {
                            return (
                                <span className="mx-1">
                                    {data?.toppingsName} (
                                    {data?.toppingsPlacement === "whole" && "W"}
                                    {data?.toppingsPlacement === "lefthalf" && "L"}
                                    {data?.toppingsPlacement === "righthalf" && "R"}
                                    {data?.toppingsPlacement === "1/4" && "1/4"}),
                                </span>
                            );
                        })}
                    </div>
                )}
                {/* Count As One */}
                {data?.toppings?.countAsOneToppings?.length > 0 && (
                    <div className="mb-1">
                        <p>Toppings (Count 1) : </p>
                        {data?.toppings?.countAsOneToppings?.map((data, index) => {
                            return (
                                <span className="mx-1">
                                    {data?.toppingsName} (
                                    {data?.toppingsPlacement === "whole" && "W"}
                                    {data?.toppingsPlacement === "lefthalf" && "L"}
                                    {data?.toppingsPlacement === "righthalf" && "R"}
                                    {data?.toppingsPlacement === "1/4" && "1/4"}),
                                </span>
                            );
                        })}
                    </div>
                )}
                {/* Free Toppings */}
                {data?.toppings?.isAllIndiansTps ?
                    <div>
                        <p>Indian Toppings + Coriander</p>
                    </div>
                    : data?.toppings?.freeToppings?.length > 0 && (
                        <div>
                            <p>Indian Toppings Toppings: </p>
                            {data?.toppings?.freeToppings?.map((data, index) => {
                                return (
                                    <span className="mx-1">
                                        {data?.toppingsName} (
                                        {data?.toppingsPlacement === "whole" && "W"}
                                        {data?.toppingsPlacement === "lefthalf" && "L"}
                                        {data?.toppingsPlacement === "righthalf" && "R"}
                                        {data?.toppingsPlacement === "1/4" && "1/4"}),
                                    </span>
                                );
                            })}
                        </div>
                    )}

            </div>
        </>
    )
}

export default CustomPizzaCart