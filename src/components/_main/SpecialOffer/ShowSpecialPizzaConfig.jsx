import ShowSignaturePizzaTps from "./ShowSpecialPizzaConfig/ShowSignaturePizzaTps"

function ShowSpecialPizzaConfig({ count, pizzaState }) {
    return (
        <>
            {<div className='border-top pizza-card-border-color mt-2'>
                <div className='row'>
                    <div className="col-lg-12 p-2">
                        <div className="d-flex align-items-center py-2 flex-wrap">
                            <p className="fw-bold primary-orange-color mb-0 d-flex align-items-center flex-wrap">
                                <span className='fs-5 me-2'>PIZZA - {count + 1}</span>
                                <span className='fs-6 text-break'>({pizzaState[count]?.signaturePizza?.pizzaName})</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>}

            {pizzaState[count] && <>
                {pizzaState[count]?.signaturePizza &&
                    <ShowSignaturePizzaTps toppings={pizzaState[count]?.signaturePizza} />
                }
            </>}
        </>
    )
}

export default ShowSpecialPizzaConfig