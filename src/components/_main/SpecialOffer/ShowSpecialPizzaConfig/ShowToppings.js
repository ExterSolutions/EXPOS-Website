import { IoMdClose } from 'react-icons/io'

function ShowToppings({ toppings, handleRemoveTopping, handleRemoveIsIndiansToppings }) {
    return (
        <>{
            (toppings?.countAsTwoToppings?.length > 0 || toppings?.countAsOneToppings?.length > 0 || toppings?.freeToppings?.length > 0) &&
            <div className="py-3 border-top pizza-card-border-color">
                <p>TOPPINGS YOU SELECTED</p>
                <div className="mt-3 d-flex flex-wrap gap-2">
                    {toppings?.countAsTwoToppings &&
                        toppings?.countAsTwoToppings.map((el) => {
                            return <div key={el?.toppingsCode}>
                                <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">{`${el?.toppingsName}(${el?.toppingsPlacement}) ($${el?.toppingsPrice})`}<span className="ms-1" onClick={() => handleRemoveTopping(el, 'countAsTwoToppings')}><IoMdClose /></span></button>
                            </div>
                        })
                    }
                    {toppings?.countAsOneToppings &&
                        toppings?.countAsOneToppings.map((el) => {
                            return <div key={el?.toppingsCode}>
                                <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">{`${el?.toppingsName}(${el?.toppingsPlacement}) ($${el?.toppingsPrice})`}<span className="ms-1" onClick={() => handleRemoveTopping(el, 'countAsOneToppings')}><IoMdClose /></span></button>
                            </div>
                        })
                    }
                    {toppings?.isAllIndiansTps ? <>
                        <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">Indian Style + Coriander <span className="ms-1" onClick={handleRemoveIsIndiansToppings}><IoMdClose /></span></button>
                    </> : <>
                        {
                            toppings?.freeToppings &&
                            toppings?.freeToppings.map((el) => {
                                return <div key={el?.toppingsCode}>
                                    <button className="px-2 py-1 btn card-secondary-tabs-background-color rounded-5 lh-sm fs-6 button-font">{`${el?.toppingsName}(${el?.toppingsPlacement}) ($${el?.toppingsPrice})`}<span className="ms-1" onClick={() => handleRemoveTopping(el, 'freeToppings')}><IoMdClose /></span></button>
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

export default ShowToppings