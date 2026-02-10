import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function SidesSelector({ data, Sides, handleSides, handleSideSizeChange }) {
    const [lineCode, setLineCode] = useState(data?.combination?.[0]?.lineCode);

    const handleChange = (e) => {
        setLineCode(e)
        if (Sides.some(obj => obj?.sideCode === data?.sideCode)) {
            const selected = data?.combination?.find((el) => el.lineCode === e);
            if (selected) {
                const payload = {
                    sideCode: data?.sideCode,
                    sideName: data?.sideName,
                    sideType: data?.type,
                    lineCode: selected?.lineCode,
                    sidePrice: selected?.price,
                    sideSize: selected?.size,
                    quantity: 1,
                    totalPrice: Number(selected?.price).toFixed(2),
                }
                handleSideSizeChange(payload)
            }
        }
    }


    const handleMainClick = () => {
        const selected = data?.combination?.find(
            (el) => el.lineCode === lineCode // Use the current selectedCombination
        );

        if (selected) {
            handleSides({
                sideCode: data?.sideCode,
                sideName: data?.sideName,
                sideType: data?.type,
                lineCode: selected?.lineCode,
                sidePrice: selected?.price,
                sideSize: selected?.size,
                quantity: 1,
                totalPrice: Number(selected?.price).toFixed(2),
            });
        }
    };


    return (
        <div
            className={`${Sides.some(item => item.sideCode === data?.sideCode) ? 'selected-card-background-color selected-card-text-color' : 'card-background-color card-text-color'} py-3 px-3 mb-3 rounded-3`}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
                if (e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION") {
                    handleMainClick();
                }
            }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="radio"
                            className="form-check-input"
                            checked={Sides.some(item => item.sideCode === data?.sideCode)}
                            readOnly
                        />
                        <p className="fs-6 mb-0">{data?.sideName}</p>
                    </div>
                    <div className="mt-3 px-3">
                        <select
                            className="px-2 outline-none rounded-1"
                            value={Sides.find(item => item?.sideCode === data?.sideCode)?.lineCode || lineCode}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleChange(e.target.value);
                            }}
                        >
                            {data?.combination?.map((comb) => (
                                <option key={comb.lineCode} value={comb.lineCode}>
                                    {`${comb.size} - $${parseFloat(comb.price).toFixed(2)}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <IoMdCheckmarkCircleOutline
                    color={Sides.some(item => item.sideCode === data?.sideCode) ? "#90EE90" : "transparent"}
                    size={25}
                />
            </div>
        </div>
    );
}

export default SidesSelector;
