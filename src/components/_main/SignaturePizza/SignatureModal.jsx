import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {GlobalContext} from "../../../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import CartFunction from "../../cart";
import { IoClose } from "react-icons/io5";

function SignatureModel({
    show,
    handleClose,
    data,
    ing,
    toppingsData,
    pizzaSize,
    pizzaQuantity,
}) {
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [settings, setSettings] = globalctx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalctx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalctx.showStorePopup;
    const cartFn = new CartFunction();

    const user = useSelector((state) => state?.user);
    const [totalPrice, setTotalPrice] = useState(0);
    const [priceCode, setPriceCode] = useState(null);
    const [crust, setCrust] = useState(null);
    const [crustype, setCrustType] = useState(null);
    const [cheese, setCheese] = useState(null);
    const [specialBase, setSpecialBase] = useState(null); // Fixed setter name
    const [spicy, setSpicy] = useState(null);
    const [sauce, setSauce] = useState(null);
    const [cook, setCook] = useState(null);

    useEffect(() => {
        if (data) {
            setPriceCode(pizzaSize);
            setCrust(data?.crust?.code);
            setCrustType(data?.crust_type?.code);
            setCheese(data?.cheese?.code);
            setSpecialBase(data?.special_base?.code);
            setSpicy(data?.spices?.code);
            setSauce(data?.sauce?.code);
            setCook(data?.cook?.code);
        }
    }, [pizzaSize]);

    const CalculatePrice = () => {
        let totalPrice = 0;
        if (priceCode && data?.pizza_prices) {
            const pizzaPrice = data.pizza_prices.filter(
                (el) => el?.shortcode === priceCode
            );
            totalPrice += pizzaPrice[0]?.price ? Number(pizzaPrice[0].price) : 0;
        }
        if (crust && ing?.crust) {
            const crustPrice = ing.crust.filter((el) => el?.crustCode === crust);
            totalPrice += crustPrice[0]?.price ? Number(crustPrice[0].price) : 0;
        }
        if (crustype && ing?.crustType) {
            const crustTypePrice = ing.crustType.filter(
                (el) => el?.crustTypeCode === crustype
            );
            totalPrice += crustTypePrice[0]?.price ? Number(crustTypePrice[0].price) : 0;
        }
        if (cheese && ing?.cheese) {
            const cheesePrice = ing.cheese.filter(
                (el) => el?.cheeseCode === cheese
            );
            totalPrice += cheesePrice[0]?.price ? Number(cheesePrice[0].price) : 0;
        }
        if (specialBase && ing?.specialbases) {
            const specialBasePrice = ing.specialbases.filter(
                (el) => el?.specialbaseCode === specialBase
            );
            totalPrice += specialBasePrice[0]?.price ? Number(specialBasePrice[0].price) : 0;
        }
        if (spicy && ing?.spices) {
            const spicyPrice = ing.spices.filter((el) => el?.spicyCode === spicy);
            totalPrice += spicyPrice[0]?.price ? Number(spicyPrice[0].price) : 0;
        }
        if (sauce && ing?.sauce) {
            const saucePrice = ing.sauce.filter((el) => el?.sauceCode === sauce);
            totalPrice += saucePrice[0]?.price ? Number(saucePrice[0].price) : 0;
        }
        if (cook && ing?.cook) {
            const cookPrice = ing.cook.filter((el) => el?.cookCode === cook);
            totalPrice += cookPrice[0]?.price ? Number(cookPrice[0].price) : 0;
        }
        let totalP = (totalPrice * Number(pizzaQuantity)).toFixed(2);
        setTotalPrice(totalP);
    };

    useEffect(() => {
        if (ing && pizzaSize) {
            CalculatePrice();
        }
    }, [
        priceCode,
        pizzaSize,
        crust,
        crustype,
        cheese,
        specialBase,
        spicy,
        sauce,
        cook,
        ing,
        pizzaQuantity,
    ]);

    const handleAddToCart = () => {
        if (currentStoreCode === undefined || currentStoreCode === null) {
            handleClose();
            setShowStorePopup(true);
            return false;
        }
        let pizza_size = data?.pizza_prices?.filter(
            (el) => el.shortcode === priceCode
        );
        let pizzastate = [];

        let crustData = ing?.crust?.filter((el) => el?.crustCode === crust);
        let crustObject = {
            crustCode: crustData[0]?.crustCode,
            crustName: crustData[0]?.crustName,
            price: crustData[0]?.price,
        };

        let crustTypeData = ing?.crustType?.filter(
            (el) => el?.crustTypeCode === crustype
        );
        let crustTypeObj = {
            crustTypeCode: crustTypeData[0]?.crustTypeCode,
            crustType: crustTypeData[0]?.crustType,
            price: crustTypeData[0]?.price,
        };

        let cheeseTypeData = ing?.cheese?.filter((el) => el?.cheeseCode === cheese);
        let cheeseObject = {
            cheeseCode: cheeseTypeData[0]?.cheeseCode,
            cheeseName: cheeseTypeData[0]?.cheeseName,
            price: cheeseTypeData[0]?.price,
        };

        let spicyTypeData = ing?.spices?.filter((el) => el?.spicyCode === spicy);
        let spicyObject = {
            spicyCode: spicyTypeData[0]?.spicyCode,
            spicy: spicyTypeData[0]?.spicy,
            price: spicyTypeData[0]?.price,
        };

        let sauceTypeData = ing?.sauce?.filter((el) => el?.sauceCode === sauce);
        let sauceObject = {
            sauceCode: sauceTypeData[0]?.sauceCode,
            sauce: sauceTypeData[0]?.sauce,
            price: sauceTypeData[0]?.price,
        };

        let cookTypeData = ing?.cook?.filter((el) => el?.cookCode === cook);
        let cookObject = {
            cookCode: cookTypeData[0]?.cookCode,
            cook: cookTypeData[0]?.cook,
            price: cookTypeData[0]?.price,
        };

        let specialBasesData = ing?.specialbases?.filter(
            (el) => el?.specialbaseCode === specialBase
        );
        let specialBasesObject = {
            specialbaseCode: specialBasesData[0]?.specialbaseCode,
            specialbaseName: specialBasesData[0]?.specialbaseName,
            price: specialBasesData[0]?.price,
        };

        let toppingTwoCode = data?.topping_as_2?.map((el) => el?.code);
        let toppingsTwoData = toppingsData?.toppings?.countAsTwo?.filter((el) =>
            toppingTwoCode?.includes(el?.toppingsCode)
        );
        let toppingTwoArray = toppingsTwoData?.map((el) => {
            let matchedToppingTwo = data?.topping_as_2?.find(
                (topping) => topping?.code === el?.toppingsCode
            );
            return {
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: matchedToppingTwo?.price || 0,
                toppingsPlacement: "whole",
                amount: matchedToppingTwo?.price || 0,
                pizzaIndex: 0,
            };
        });

        let toppingOneCode = data?.topping_as_1?.map((el) => el?.code);
        let toppingsOneData = toppingsData?.toppings?.countAsOne?.filter((el) =>
            toppingOneCode?.includes(el?.toppingsCode)
        );
        let toppingOneArray = toppingsOneData?.map((el) => {
            let matchedToppingOne = data?.topping_as_1?.find(
                (topping) => topping?.code === el?.toppingsCode
            );
            return {
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: matchedToppingOne?.price || 0,
                toppingsPlacement: "whole",
                amount: matchedToppingOne?.price || 0,
                pizzaIndex: 0,
            };
        });

        let toppingFreeCode = data?.topping_as_free?.map((el) => el?.code);
        let toppingsFreeData = toppingsData?.toppings?.freeToppings?.filter((el) =>
            toppingFreeCode?.includes(el?.toppingsCode)
        );
        let toppingFreeArray = toppingsFreeData?.map((el) => {
            let matchedToppingFree = data?.topping_as_free?.find(
                (topping) => topping?.code === el?.toppingsCode
            );
            return {
                toppingsCode: el?.toppingsCode,
                toppingsName: el?.toppingsName,
                toppingsPrice: matchedToppingFree?.price || 0,
                toppingsPlacement: "whole",
                amount: matchedToppingFree?.price || 0,
                pizzaIndex: 0,
            };
        });

        let allIndiansToppings = false;
        if (
            toppingsData?.toppings?.freeToppings?.length === toppingFreeArray?.length
        ) {
            allIndiansToppings = true;
        }

        let payload = {
            crust: crustObject,
            cheese: cheeseObject,
            crustType: crustTypeObj,
            specialBases: specialBasesObject,
            spicy: spicyObject,
            sauce: sauceObject,
            cook: cookObject,
            toppings: {
                countAsTwoToppings: toppingTwoArray || [],
                countAsOneToppings: toppingOneArray || [],
                freeToppings: toppingFreeArray || [],
                isAllIndiansTps: allIndiansToppings,
            },
        };
        pizzastate.push(payload);
        const obj = {
            id: uuidv4(),
            customerCode: user?.data?.customerCode,
            cashierCode: "#NA",
            productCode: data.code,
            productName: data.pizza_name,
            productType: "signature_pizza",
            config: {
                pizza: pizzastate,
                sides: [],
                dips: [],
                drinks: [],
            },
            price: totalPrice,
            quantity: pizzaQuantity,
            amount: totalPrice,
            taxPer: 0,
            pizzaSize: pizza_size[0]?.size,
            pizzaPrice: pizza_size[0]?.price,
            comments: "",
        };

        if (obj) {
            let ct = JSON.parse(localStorage.getItem("cart")) || { product: [] };
            ct.product.push(obj);
            const cartProduct = ct.product;
            cartFn.addCart(cartProduct, setCart, false, settings);
        }

        handleClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className="primary-background-color bg-light">
                <div className="d-flex flex-column">
                    <Modal.Title>
                        {data.pizza_name} (${totalPrice})
                    </Modal.Title>
                    <div>
                        Quantity :
                        <span className="mx-2">
                            <strong>{pizzaQuantity}</strong>
                        </span>
                    </div>
                </div>
                <IoClose
                    className="close-icon"
                    onClick={handleClose}
                    size={24}
                />
            </Modal.Header>
            <Modal.Body
                className="primary-background-color primary-text-color"
                style={{ maxHeight: "350px", overflow: "auto" }}
            >
                <div className="p-2">
                    <div className="row mb-2 gap-3">
                        <Col xs={12}>
                            <label className="mb-2">Select Size:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={priceCode}
                                onChange={(e) => setPriceCode(e.target.value)}
                            >
                                {data?.pizza_prices
                                    ?.filter((price) => parseFloat(price.price) > 0)
                                    ?.map((el) => (
                                        <option value={el?.shortcode} key={el?.shortcode}>
                                            {el.size} ${el?.price}
                                        </option>
                                    ))}
                            </select>
                        </Col>

                        <Col xs={12}>
                            <label className="mb-2">Crust:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={crust}
                                onChange={(e) => setCrust(e.target.value)}
                            >
                                {ing?.crust?.map((el) => (
                                    <option value={el?.crustCode} key={el?.crustCode}>
                                        {el?.crustName} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>
                        <Col xs={12}>
                            <label className="mb-2">Crust Type:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={crustype}
                                onChange={(e) => setCrustType(e.target.value)}
                            >
                                {ing?.crustType?.map((el) => (
                                    <option value={el?.crustTypeCode} key={el?.crustTypeCode}>
                                        {el?.crustType} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>

                        <Col xs={12}>
                            <label className="mb-2">Cheese:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={cheese}
                                onChange={(e) => setCheese(e.target.value)}
                            >
                                {ing?.cheese?.map((el) => (
                                    <option value={el?.cheeseCode} key={el?.cheeseCode}>
                                        {el?.cheeseName} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>
                        <Col xs={12}>
                            <label className="mb-2">Special Bases:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={specialBase}
                                onChange={(e) => setSpecialBase(e.target.value)}
                            >
                                {ing?.specialbases?.map((el) => (
                                    <option
                                        value={el?.specialbaseCode}
                                        key={el?.specialbaseCode}
                                    >
                                        {el?.specialbaseName} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>

                        <Col xs={12}>
                            <label className="mb-2">Spicy:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={spicy}
                                onChange={(e) => setSpicy(e.target.value)}
                            >
                                {ing?.spices?.map((el) => (
                                    <option value={el?.spicyCode} key={el?.spicyCode}>
                                        {el?.spicy} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>
                        <Col xs={12}>
                            <label className="mb-2">Sauce:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={sauce}
                                onChange={(e) => setSauce(e.target.value)}
                            >
                                {ing?.sauce?.map((el) => (
                                    <option value={el?.sauceCode} key={el?.sauceCode}>
                                        {el?.sauce} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>

                        <Col xs={12}>
                            <label className="mb-2">Cook:</label>
                            <select
                                style={{ width: "100%" }}
                                className="form-select"
                                value={cook}
                                onChange={(e) => setCook(e.target.value)}
                            >
                                {ing?.cook?.map((el) => (
                                    <option value={el?.cookCode} key={el?.cookCode}>
                                        {el?.cook} ${el?.price}
                                    </option>
                                ))}
                            </select>
                        </Col>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="primary-background-color primary-text-color">
                <Button
                    className="view-button"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignatureModel;