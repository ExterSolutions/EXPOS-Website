function SpecialPizzaCart({ data, index }) {
    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
    return (
        <>
            <div className="mb-0 fw-medium sm-font">
                Pizza {(index + 1)} ({data?.signaturePizzaName})
            </div>
            <div className="">
                {data?.crust && isEmptyObject(data?.crust) === false && (
                    <div className="">
                        <span>- Crust :</span>
                        <span>{data?.crust?.crustName}</span>
                    </div>
                )}
                {data?.cheese && isEmptyObject(data?.cheese) === false && (
                    <div className="">
                        <span>- Cheese :</span>
                        <span>{data?.cheese?.cheeseName}</span>
                    </div>
                )}
                {data?.specialBases &&
                    isEmptyObject(data?.specialBases) === false && (
                        <div className="">
                            <span>- Specialbases :</span>
                            <span>{data?.specialBases?.specialbaseName}</span>
                        </div>
                    )}
                {data?.spicy && isEmptyObject(data?.spicy) === false && (
                    <div className="">
                        <span>- Spicy :</span>
                        <span>{data?.spicy?.spicy}</span>
                    </div>
                )}
                {data?.sauce && isEmptyObject(data?.sauce) === false && (
                    <div className="">
                        <span>- Sauce :</span>
                        <span>{data?.sauce?.sauce}</span>
                    </div>
                )}
                {data?.cook && isEmptyObject(data?.cook) === false && (
                    <div className="">
                        <span>- Cook :</span>
                        <span>{data?.cook?.cook}</span>
                    </div>
                )}
                {/* Toppings Display */}
                <div className="sm-font">
                    {data?.toppings?.countAsTwoToppings.length > 0 && (
                        <div className="">
                            <span>- Toppings (x2) : </span>
                            {data?.toppings?.countAsTwoToppings?.map((t, idx) => (
                                <span key={idx} className="mx-1">
                                    {t?.toppingsName} ({t?.toppingsPlacement === "whole" ? "W" : t?.toppingsPlacement === "lefthalf" ? "L" : t?.toppingsPlacement === "righthalf" ? "R" : t?.toppingsPlacement}),
                                </span>
                            ))}
                        </div>
                    )}
                    {data?.toppings?.countAsOneToppings?.length > 0 && (
                        <div className="">
                            <span>- Toppings (x1) : </span>
                            {data?.toppings?.countAsOneToppings?.map((t, idx) => (
                                <span key={idx} className="mx-1">
                                    {t?.toppingsName} ({t?.toppingsPlacement === "whole" ? "W" : t?.toppingsPlacement === "lefthalf" ? "L" : t?.toppingsPlacement === "righthalf" ? "R" : t?.toppingsPlacement}),
                                </span>
                            ))}
                        </div>
                    )}
                    {data?.toppings?.freeToppings?.length > 0 && (
                        <div className="">
                            <span>- Indian Toppings : </span>
                            {data?.toppings?.freeToppings?.map((t, idx) => (
                                <span key={idx} className="mx-1">
                                    {t?.toppingsName},
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SpecialPizzaCart