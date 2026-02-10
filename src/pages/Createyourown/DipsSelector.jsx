import { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const DipsSelector = ({ data, Dips, handleDips, handleDipsQuantity }) => {
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        setQuantity(Dips?.find(item => item.code === data?.dipsCode)?.quantity || quantity);
    }, [])
    useEffect(() => {
        let totalPrice = Number(data?.price) * quantity;
        let fixed_price = totalPrice?.toFixed(2);
        setPrice(Number(data?.price))
        setTotalPrice(fixed_price)
    }, [quantity])

    const handleQuantityChange = (d) => {
        setQuantity(+quantity + d)
        if (Dips?.some(item => item.code === data?.dipsCode)) {
            let new_quantity = +quantity + d;
            let new_price = Number(data?.price) * new_quantity;
            let new_fixed_price = new_price.toFixed(2);
            let payload = {
                code: data?.dipsCode,
                name: data?.dipsName,
                quantity: new_quantity,
                price: Number(data?.price),
                totalPrice: Number(new_fixed_price)
            }
            handleDipsQuantity(payload)
        }
    }

    useEffect(() => {
        if (!Dips?.some(item => item.code === data?.dipsCode)) setQuantity(1);
    }, [Dips, data?.dipsCode])

    return (
        <div className={`${Dips?.some(item => item.code === data?.dipsCode) ? 'selected-card-background-color selected-card-text-color' : 'card-background-color card-text-color'} py-3 px-3 mb-3 rounded-3`} style={{ cursor: "pointer" }}
            onClick={(e) => {
                if (e.target.tagName !== "BUTTON") {
                    handleDips({ code: data?.dipsCode, name: data?.dipsName, quantity: quantity, price: price, totalPrice: totalPrice })
                }
            }
            }
        >
            <div className="d-flex justify-content-between align-items-center" >
                <div className="">
                    <div className="d-flex align-items-center gap-2">
                        <input type="radio" className="form-check-input" checked={Dips?.some(item => item.code === data?.dipsCode)} />
                        <p className="fs-6">{`${data?.dipsName} ($ ${data?.price})`}</p>
                    </div>
                    <div className="mt-3 px-3 d-flex align-items-center gap-2">
                        <button disabled={Dips?.some(item => item.code === data?.dipsCode) ? quantity <= 1 : true} onClick={() => handleQuantityChange(-1)} className={`${Dips?.some(item => item.code === data?.dipsCode) ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 w-2`}>-</button>
                        <p>{quantity}</p>
                        <button disabled={Dips?.some(item => item.code === data?.dipsCode) ? quantity >= 10 : true} onClick={() => handleQuantityChange(1)} className={`${Dips?.some(item => item.code === data?.dipsCode) ? 'selected-quantity-btn' : 'bg-transparent'} border-1 rounded-2 fs-6 w-1`}>+</button>
                    </div>
                </div>
                {Dips?.some(item => item.code === data?.dipsCode) ? <IoMdCheckmarkCircleOutline color="#90EE90" size={25} /> : <IoMdCheckmarkCircleOutline color="transparent" size={25} />}
            </div>
        </div>
    )
}