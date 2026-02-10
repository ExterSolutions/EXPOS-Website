function ShowSignaturePizzaTps({ toppings }) {
    return (
        <>
            {
                (toppings?.toppings?.length > 0 || toppings?.freeToppings?.length > 0 || toppings?.indianToppings) &&
                <div className="py-3 border-top pizza-card-border-color">
                    <p>TOPPINGS YOU SELECTED</p>
                    <div className="mt-3 d-flex flex-wrap gap-2">
                        {toppings?.toppings &&
                            toppings?.toppings.map((el) => {
                                return <div key={el?.code}>
                                    <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">{`${el?.name} (${el?.count})`}<span className="ms-1"></span></button>
                                </div>
                            })
                        }
                        {toppings?.indianToppings ? <>
                            <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">Indian Style + Coriander <span className="ms-1"></span></button>
                        </> : <>
                            {
                                toppings?.freeToppings &&
                                toppings?.freeToppings.map((el) => {
                                    return <div key={el?.code}>
                                        <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">{`${el?.name}`}<span className="ms-1"></span></button>
                                    </div>
                                })
                            }

                        </>
                        }
                    </div>
                </div>}
        </>

    )
}

export default ShowSignaturePizzaTps