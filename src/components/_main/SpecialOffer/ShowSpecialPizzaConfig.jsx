import ShowSignaturePizzaTps from "./ShowSpecialPizzaConfig/ShowSignaturePizzaTps"

function ShowSpecialPizzaConfig({ count, pizzaState }) {
    return (
        <>
            {<div className='border-top pizza-card-border-color mt-2'>
                <div className='row'>
                    <div className="col-lg-12 ">
                        <div className="d-flex align-items-center  flex-wrap">
                            <p className="fw-bold primary-orange-color mb-0 d-flex align-items-center flex-wrap">
                                <span className='fs-5 me-2'>PIZZA - {count + 1}</span>
                                {/* <span className='fs-6 text-break'>({pizzaState[count]?.signaturePizza?.pizzaName})</span> */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>}

            {pizzaState[count] && (
                <div className="px-3 py-1">
                    <div className="d-flex flex-column gap-1 mb-2 cart-selection-summary " style={{ fontSize: '0.9rem' }}>
                       

                        {pizzaState[count]?.cheese?.cheeseName && <p className="mb-0">Cheese: <span className="text-black">{pizzaState[count].cheese.cheeseName}</span></p>}
                        {pizzaState[count]?.crust?.crustName && <p className="mb-0">Crust: <span className="text-dark">{pizzaState[count].crust.crustName}</span></p>}
                        {pizzaState[count]?.crustType?.crustTypeName && <p className="mb-0">Crust Type: <span className="text-dark">{pizzaState[count].crustType.crustTypeName}</span></p>}
                        {pizzaState[count]?.specialBases?.specialbaseName && <p className="mb-0">Special Base: <span className="text-dark">{pizzaState[count].specialBases.specialbaseName}</span></p>}
                        {(pizzaState[count]?.sauce?.sauce || pizzaState[count]?.sauce?.sauceName) && <p className="mb-0">Sauce: <span className="text-dark">{pizzaState[count].sauce.sauce || pizzaState[count].sauce.sauceName}</span></p>}
                        {(pizzaState[count]?.cook?.cook || pizzaState[count]?.cook?.cookName) && <p className="mb-0">Cook: <span className="text-dark">{pizzaState[count].cook.cook || pizzaState[count].cook.cookName}</span></p>}
                        {(pizzaState[count]?.spicy?.spicy || pizzaState[count]?.spicy?.spicyName) && <p className="mb-0">Spicy: <span className="text-dark">{pizzaState[count].spicy.spicy || pizzaState[count].spicy.spicyName}</span></p>}

                        <div className="mt-2">
                            <p className="mb-1 fw-bold text-dark">Toppings:</p>
                            <div className="d-flex flex-wrap gap-2">
                                {pizzaState[count]?.toppings?.countAsTwoToppings?.map((el, i) => (
                                    <span key={`two-${i}`} className="badge bg-light text-dark border">
                                        {el.toppingsName}
                                    </span>
                                ))}
                                {pizzaState[count]?.toppings?.countAsOneToppings?.map((el, i) => (
                                    <span key={`one-${i}`} className="badge bg-light text-dark border">
                                        {el.toppingsName}
                                    </span>
                                ))}
                                {pizzaState[count]?.toppings?.freeToppings?.map((el, i) => (
                                    <span key={`free-${i}`} className="badge bg-light text-dark border">
                                        {el.toppingsName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ShowSpecialPizzaConfig