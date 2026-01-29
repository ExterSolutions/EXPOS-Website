import React, { useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function ToppingsTwoSelector({ data, ToppingsTwo, handleTopping, handleSizeChange }) {
    const [pizzaSize, setPizzaSize] = useState("whole");

    // Handle Topping Placement Change 
    const handleChange = (d) => {
        setPizzaSize(d)
        if (ToppingsTwo.some(obj => obj?.toppingsCode === data?.toppingsCode)) {
            let payload = {
                toppingsCode: data?.toppingsCode,
                toppingsPlacement: d
            }
            handleSizeChange(payload);
        }
    }

    return (
        <div className={`${ToppingsTwo?.some(obj => obj?.toppingsCode === data?.toppingsCode) ? 'active' : ''}  py-3 px-3 mb-3 rounded-3`} style={{ cursor: "pointer" }}
            onClick={(e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION") {
                    handleTopping({ toppingsCode: data?.toppingsCode, toppingsName: data?.toppingsName, toppingsPrice: data?.price, type: "two", size: pizzaSize })
                }
            }}>
            <div className="d-flex justify-content-between align-items-center" >
                <div className="">
                    <div className="d-flex align-items-center gap-2">
                        <input type="radio" className="form-check-input" defaultChecked={false} checked={ToppingsTwo?.some(obj => obj?.toppingsCode === data?.toppingsCode)} />
                        <p className="fs-6">
                            {`${data?.toppingsName} ($ ${data?.price})`}
                        </p>

                    </div>
                    <div className="mt-3 px-3">
                        <select className="px-2 outline-none rounded-1" value={ToppingsTwo?.find((el) => el?.toppingsCode === data?.toppingsCode)?.toppingsPlacement || pizzaSize} onChange={(e) => handleChange(e.target.value)}>
                            <option value={"whole"}>Whole</option>
                            <option value={"righthalf"}>Right Half</option>
                            <option value={"lefthalf"}>Left Half</option>
                            <option value={"1/4"}>1/4</option>
                        </select>
                    </div>
                </div>
                {ToppingsTwo?.some(obj => obj?.toppingsCode === data?.toppingsCode) ? <IoMdCheckmarkCircleOutline color="#90EE90" size={25} /> : <IoMdCheckmarkCircleOutline color="transparent" size={25} />}
            </div>
        </div>
    )
}

export default ToppingsTwoSelector