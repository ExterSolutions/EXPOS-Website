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
            </div>
        </>
    )
}

export default SpecialPizzaCart