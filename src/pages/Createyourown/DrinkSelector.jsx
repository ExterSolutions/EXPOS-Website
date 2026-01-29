import { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const DrinkSelector = ({ data, Drinks, handleDrink, handleDrinkQuantity }) => {
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        setQuantity(Drinks?.find(item => item.code === data?.softdrinkCode)?.quantity || quantity);
    }, [])

    useEffect(() => {
        let totalPrice = Number(data?.price) * quantity;
        let fixed_price = totalPrice?.toFixed(2);
        setPrice(data?.price)
        setTotalPrice(fixed_price)
    }, [quantity])

    const handleQuantityChange = (d) => {
        setQuantity(+quantity + d)
        if (Drinks?.some(item => item.code === data?.softdrinkCode)) {
            let new_quantity = +quantity + d;
            let new_price = Number(data?.price) * new_quantity;
            let new_fixed_price = new_price.toFixed(2);
            let payload = {
                code: data?.softdrinkCode,
                name: data?.softDrinksName,
                quantity: new_quantity,
                price: Number(data?.price),
                totalPrice: Number(new_fixed_price)
            }
            handleDrinkQuantity(payload)
        }
    }

    useEffect(() => {
        if (!Drinks?.some(item => item.code === data?.softdrinkCode)) setQuantity(1);
    }, [Drinks, data?.softdrinkCode])


    return (
        <div className={`${Drinks?.some(item => item.code === data?.softdrinkCode) ? 'selected-card-background-color selected-card-text-color' : 'card-background-color card-text-color'} py-3 px-3 mb-3 rounded-3`} style={{ cursor: "pointer" }}
            onClick={(e) => {
                if (e.target.tagName !== "BUTTON") {
                    handleDrink({ code: data?.softdrinkCode, name: data?.softDrinksName, quantity: quantity, price: price, totalPrice: totalPrice })
                }
            }}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="">
                    <div className="d-flex align-items-center gap-2">
                        <input type="radio" className="form-check-input" checked={Drinks?.some(item => item.code === data?.softdrinkCode)} />
                        <p className="fs-6">{`${data?.softDrinksName} ($ ${data?.price})`}</p>
                    </div>
                    <div className="mt-3 px-3 d-flex align-items-center gap-2">
                        <button disabled={Drinks?.some(item => item.code === data?.softdrinkCode) ? quantity <= 1 : true} onClick={() => handleQuantityChange(-1)} className={`${Drinks?.some(item => item.code === data?.softdrinkCode) ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 w-2`}>-</button>
                        <p>{quantity}</p>
                        <button disabled={Drinks?.some(item => item.code === data?.softdrinkCode) ? quantity >= 10 : true} onClick={() => handleQuantityChange(1)} className={`${Drinks?.some(item => item.code === data?.softdrinkCode) ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 fs-6 w-1`}>+</button>
                    </div>
                </div>
                {Drinks?.some(item => item.code === data?.softdrinkCode) ? <IoMdCheckmarkCircleOutline color="#90EE90" size={25} /> : <IoMdCheckmarkCircleOutline color="transparent" size={25} />}
            </div>
        </div >
    )
}