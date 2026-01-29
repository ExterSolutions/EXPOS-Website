import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
// push
export const ToppingOneSelector = ({ data, ToppingsOne, DefaultToppingsOne, handleTopping, handleSizeChange }) => {
    const [pizzaSize, setpizzaSize] = useState("whole");

    const handleChange = (d) => {
        setpizzaSize(d)
        if (ToppingsOne.some(obj => obj?.code === data?.toppingsCode)) {
            let updatedPrice = data?.price;
            const matchingToppingTwo = DefaultToppingsOne?.find(tps => data?.toppingsCode === tps.code);
            if (matchingToppingTwo) {
                updatedPrice = matchingToppingTwo?.price ?? 0
            }
            let payload = {
                code: data?.toppingsCode,
                name: data?.toppingsName,
                price: updatedPrice,
                type: "one",
                size: d
            }
            handleSizeChange(payload);
        }
    }

    return (
        <div
            key={`${data?.toppingsName}-${data?.toppingsCode}`}
            className={`theme-border ${ToppingsOne.some(obj => obj?.code === data?.toppingsCode) ? 'active' : ''}`}
            onClick={(e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION") {
                    handleTopping({
                        code: data?.toppingsCode,
                        name: data?.toppingsName,
                        price: data?.price,
                        type: "one",
                        size: pizzaSize,
                    });
                }
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    {ToppingsOne.some(obj => obj?.code === data?.toppingsCode) ? (
                        <i className="bi bi-check-circle-fill" />
                    ) : (
                        <i className="bi bi-plus-circle" />
                    )}
                    <span className="fw-semibold">
                        {`${data?.toppingsName}`}
                    </span>
                    <span>(${DefaultToppingsOne?.find(obj => obj?.code === data?.toppingsCode)?.price ?? data?.price})</span>
                </div>
            </div>
            <div className="row">
                <div className="mt-2 col-12">
                    <select className="px-2 outline-none rounded-1" value={ToppingsOne?.find((el) => el?.code === data?.toppingsCode)?.size || pizzaSize}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleChange(e.target.value)
                        }
                        }
                    >
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