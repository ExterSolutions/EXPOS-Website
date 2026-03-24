import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io"

export const FreeToppingSelector = ({ data, ToppingsFree, handleTopping, handleSizeChange }) => {
    const [pizzaSize, setpizzaSize] = useState("whole");

    const handleChange = (d) => {
        setpizzaSize(d)
        if (ToppingsFree.some(obj => obj?.code === data?.toppingsCode)) {
            let payload = {
                code: data?.toppingsCode,
                name: data?.toppingsName,
                price: data?.price,
                type: "free",
                size: d
            }
            handleSizeChange(payload);
        }

    }


    return (

        <div
            key={`${data?.toppingsName}-${data?.toppingsCode}`}
            className={`theme-border ${ToppingsFree.some(obj => obj?.code === data?.toppingsCode) ? 'active' : ''}`}
            onClick={(e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION") {
                    handleTopping({ code: data?.toppingsCode, name: data?.toppingsName, price: data?.price, type: "free", size: pizzaSize })
                }
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    {ToppingsFree.some(obj => obj?.code === data?.toppingsCode) ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <span className="fw-semibold">
                        {`${data?.toppingsName}`}
                    </span>
                    {data?.price !== null && <span>(${data?.price})</span>}
                </div>
            </div>
            <div className="row">
                <div className="mt-2 col-12">
                    <select className="form-select form-select-sm" value={ToppingsFree?.find((el) => el?.code === data?.toppingsCode)?.size || pizzaSize} onChange={(e) => handleChange(e.target.value)}>
                        <option value={"whole"}>Whole</option>
                        <option value={"righthalf"}>Right Half</option>
                        <option value={"lefthalf"}>Left Half</option>
                        <option value={"1/4"}>1/4</option>
                    </select>
                </div>
            </div>
        </div>
    )
}