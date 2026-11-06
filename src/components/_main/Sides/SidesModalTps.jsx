import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import SideToppings from "./SideToppings";
import { useSelector } from "react-redux";
import {GlobalContext} from "../../../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import CartFunction from "../../cart";
import { toast } from "react-toastify";

function SidesModalTps({
    show,
    handleClose,
    data,
    count,
    sPlacementRef,
    setCount,
}) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings] = globalctx.settings;
    const cartFn = new CartFunction();

    const [selectedTps, setSelectedTps] = useState([]);
    const user = useSelector((state) => state?.user);

    // handle Sides with Toppings
    const handleSideTps = () => {
        if (selectedTps.length > 0) {
            const toppingsString = selectedTps
                .map((item) => item.toppingsName)
                .join(", ");
            let combinationData = {};
            if (sPlacementRef.current) {
                const selectedCode = sPlacementRef.current.value;
                combinationData = data?.combination?.find(
                    (code) => code.lineCode === selectedCode
                );
            }

            const unitPrice = Number(combinationData?.price || 0);
            const totalPrice = unitPrice * count;
            const obj = {
                id: uuidv4(),
                customerCode: user?.data?.customerCode,
                cashierCode: "#NA",
                productCode: data.sideCode,
                productName: data.sideName,
                productType: "side",
                config: {
                    lineCode: combinationData?.lineCode,
                    sidesSize: combinationData?.size,
                    sidesType: data?.type,
                },
                price: unitPrice.toFixed(2),
                quantity: count,
                amount: totalPrice.toFixed(2),
                taxPer: 0,
                pizzaSize: "",
                comments: toppingsString ? toppingsString : "",
            };

            let ct = JSON.parse(localStorage.getItem("cart") || "null") || { product: [] };
            if (!Array.isArray(ct.product)) ct.product = [];
            ct.product.push(obj);
            cartFn.addCart(ct.product, setCart, false, settings);
            toast.success("Added to cart! 🛒");
            setCount(1);
            setSelectedTps([]);
            if (sPlacementRef.current) {
                sPlacementRef.current.value = data?.combination?.[0]?.lineCode;
            }
            handleClose();
        } else {
            toast.warning("Please select at least one topping.");
        }
    };

    const handleCancel = () => {
        setSelectedTps([]);
        handleClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleCancel}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className="primary-background-color" closeButton>
                <Modal.Title>
                    <div className="fs-6 text-capitalize"><span className="sideType">{data?.type}</span></div>
                    <div className="text-capitalize">{data?.sideName}</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="primary-background-color">
                <div className="p-2">
                    <p className="mb-2 fs-5 fw-bold">Select Toppings</p>
                    <label className="mb-4">
                        Number of Toppings :
                        <span className="mx-3">
                            <strong>
                                {0 + selectedTps.length}/{Number(data.nooftoppings)}
                            </strong>
                        </span>
                    </label>
                    <Row>
                        {data.sidesToppings && data.sidesToppings.length > 0
                            ? data.sidesToppings.map((tps) => {
                                return (
                                    <SideToppings
                                        key={tps.code}
                                        tps={tps}
                                        selectedTps={selectedTps}
                                        setSelectedTps={setSelectedTps}
                                        data={data}
                                    />
                                );
                            })
                            : "Toppings Not Found."}
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className="primary-background-color">
                <Button type="button" className="tps_cart_btn" onClick={handleSideTps}>
                    Add to Cart
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SidesModalTps;
