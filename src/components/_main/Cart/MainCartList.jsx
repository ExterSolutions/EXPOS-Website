import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import CartFunction from "../../cart";

function MainCartList({ cData, setLoading }) {
    // Global Context
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [payloadEdit, setPayloadEdit] = globalctx.productEdit;
    const [settings, setSettings] = globalctx.settings;

    // Helper Function
    const cartFn = new CartFunction();
    const navigate = useNavigate();
    // Handle Delete Product
    const handleDelete = () => {
        if (cart?.product?.length === 1) {
            cartFn.deleteCart(cData, cart, setCart, settings);
            localStorage.removeItem("cart");
            setCart();
            setPayloadEdit();
            cartFn.createCart(setCart);
        } else {
            if (payloadEdit) {
                if (payloadEdit?.id === cData?.id) {
                    setPayloadEdit();
                    cartFn.deleteCart(cData, cart, setCart, settings);
                } else {
                    cartFn.deleteCart(cData, cart, setCart, settings);
                }
            } else {
                cartFn.deleteCart(cData, cart, setCart, settings);
            }
        }
    };
    // Handle Edit Product
    const handleEdit = () => {
        if (cData?.productType === "custom_pizza" && cData?.id) {
            setPayloadEdit(cData);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                navigate("/create-your-own");
            }, 1200);
        }
        if ((cData?.productType === "special_pizza" || cData?.productType === "special_pizza_topping") && cData?.id) {
            setPayloadEdit(cData);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                if (cData?.productType === "special_pizza") {
                    navigate(`/specialoffer/${cData?.productCode}/${cData?.id}`);
                } else {
                    navigate(`/special-offers-with-toppings/${cData?.productCode}/${cData?.id}`);
                }
            }, 1200);
        }
    };

    // isEmptyObject
    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <li className="list-group-item cartlistitem bgPrimaryBlackColor primaryWhiteColor">
            <div className="px-3 d-flex align-items-center flex-column py-2">
                <div className="w-100 d-flex justify-content-between align-items-top flex-row">
                    <h5 className="mb-2" style={{ wordWrap: "break-word" }}>
                        {cData.productName}
                    </h5>
                    <h5 className="mb-2 text-end mx-2 amount">
                        $ {Number(cData.amount).toFixed(2)}
                    </h5>
                </div>
                <div className="w-100 d-flex justify-content-between align-items-center flex-row">
                    {/* Quantity */}
                    <div className="w-100 d-flex text-start my-2 main-cartQty">
                        <p>Quantity :</p> <span className="mx-2">{cData?.quantity}</span>
                    </div>
                    <div className="main-cartIcons my-2">
                        <i
                            className="fa fa-trash mx-2 deleteIcon"
                            aria-hidden="true"
                            onClick={handleDelete}
                        ></i>
                        {cData.productType === "special_pizza" ||
                            cData.productType === "special_pizza_topping" ||
                            cData.productType === "custom_pizza" ? (
                            <i
                                className="fa fa-edit mx-2 editIcon"
                                aria-hidden="true"
                                onClick={handleEdit}
                            ></i>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                {/* Pizza Size */}
                {cData?.config?.sidesSize && (
                    <>
                        <div className="w-100 d-flex mb-2 text-start main-cartPizzaSize">
                            <p className="">Size : </p>
                            <span className="mx-2">
                                {cData?.config?.sidesSize ? cData?.config?.sidesSize : ""}
                            </span>
                        </div>
                        {cData?.comments !== "" && (
                            <div className="w-100 d-flex mb-2 text-start main-cartPizzaSize">
                                <p className="">Comments : </p>
                                <span className="mx-2">{cData?.comments}</span>
                            </div>
                        )}
                    </>
                )}
                {cData?.pizzaSize && (
                    <div className="w-100 d-flex mb-2 text-start main-cartPizzaSize">
                        <p className="">Size : </p>
                        <span className="mx-2">
                            {cData?.pizzaSize !== "" ? cData?.pizzaSize : ""}
                        </span>
                    </div>
                )}
                {cData?.pizzaPrice && (
                    <div className="w-100 d-flex mb-2 text-start main-cartPizzaSize">
                        <p className="">Pizza Price : </p>
                        <span className="mx-2">
                            $ {cData?.pizzaPrice !== "" ? cData?.pizzaPrice : ""}
                        </span>
                    </div>
                )}

                <div className="w-100 d-flex justify-content-start flex-column main-cartList">
                    {cData?.config?.pizza &&
                        cData?.config?.pizza.length > 0 &&
                        cData?.config?.pizza.map((data, index) => {
                            return (
                                <div
                                    className="w-100 d-flex justify-content-start flex-column main-cartPizza"
                                    key={index}
                                >
                                    <h4 className="mb-1 mt-1">
                                        {cData?.productType === "custom_pizza"
                                            ? "Pizza"
                                            : "Pizza " + (index + 1)}
                                    </h4>

                                    {data?.crust && isEmptyObject(data?.crust) === false && (
                                        <div className="mb-1 crust">
                                            <p className="d-inline">Crust :</p>
                                            <span className="d-inline">{data?.crust?.crustName}</span>
                                        </div>
                                    )}
                                    {data?.cheese && isEmptyObject(data?.cheese) === false && (
                                        <div className="mb-1 cheese">
                                            <p className="d-inline">Cheese :</p>
                                            <span className="d-inline">
                                                {data?.cheese?.cheeseName}
                                            </span>
                                        </div>
                                    )}
                                    {data?.specialBases &&
                                        isEmptyObject(data?.specialBases) === false && (
                                            <div className="mb-1 specialbases">
                                                <p className="d-inline">Specialbases :</p>
                                                <span className="d-inline">
                                                    {data?.specialBases?.specialbaseName}
                                                </span>
                                            </div>
                                        )}
                                    {data?.spicy && isEmptyObject(data?.spicy) === false && (
                                        <div className="mb-1 cheese">
                                            <p className="d-inline">Spicy :</p>
                                            <span className="d-inline">{data?.spicy?.spicy}</span>
                                        </div>
                                    )}
                                    {data?.sauce && isEmptyObject(data?.sauce) === false && (
                                        <div className="mb-1 cheese">
                                            <p className="d-inline">Sauce :</p>
                                            <span className="d-inline">{data?.sauce?.sauce}</span>
                                        </div>
                                    )}
                                    {data?.cook && isEmptyObject(data?.cook) === false && (
                                        <div className="mb-1 cheese">
                                            <p className="d-inline">Cook :</p>
                                            <span className="d-inline">{data?.cook?.cook}</span>
                                        </div>
                                    )}
                                    <div className="mb-1">
                                        {/* Count As Two */}
                                        {data?.toppings?.countAsTwoToppings.length > 0 && (
                                            <div className="mb-1">
                                                <p>Toppings (Count 2) : </p>
                                                {data?.toppings?.countAsTwoToppings?.map((data) => {
                                                    return (
                                                        <span className="mx-1" key={data?.toppingsCode}>
                                                            {data?.toppingsName} ({data?.toppingsPlacement}),
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {/* Count As One */}
                                        {data?.toppings?.countAsOneToppings?.length > 0 && (
                                            <div className="mb-1">
                                                <p>Toppings (Count 1) : </p>
                                                {data?.toppings?.countAsOneToppings?.map((data) => {
                                                    return (
                                                        <span className="mx-1" key={data?.toppingsCode}>
                                                            {data?.toppingsName} ({data?.toppingsPlacement}),
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {/* Free Toppings */}
                                        {data?.toppings?.freeToppings?.length > 0 && (
                                            <div>
                                                <p>Indian Toppings Toppings: </p>
                                                {data?.toppings?.freeToppings?.map((data) => {
                                                    return (
                                                        <span className="mx-1" key={data?.toppingsCode}>
                                                            {data?.toppingsName} ({data?.toppingsPlacement}),
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    {/* Sides */}
                    {cData?.config?.sides?.length > 0 && (
                        <div className="w-100 d-flex justify-content-start flex-wrap align-items-center main-cartPizza mb-1">
                            <p>Sides :</p>
                            {cData?.config?.sides?.map((data, index) => {
                                return (
                                    <span>
                                        {data?.sideName} ({data?.sideSize})
                                        {cData?.config?.sides?.length === index + 1 ? "" : ","}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {/* Dips */}
                    {cData?.config?.dips?.length > 0 && (
                        <div className="w-100 d-flex justify-content-start align-items-center flex-warp main-cartPizza mb-1">
                            <p>Dips: </p>
                            {cData?.config?.dips?.map((data, index) => {
                                return (
                                    <span>
                                        {data?.dipsName}{" "}
                                        {cData?.config?.dips?.length === index + 1 ? "" : ","}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {/* Drinks */}
                    {cData?.config?.drinks?.length > 0 && (
                        <div className="w-100 d-flex justify-content-start align-items-center main-cartPizza mb-1">
                            <p>Drinks: </p>
                            {cData?.config?.drinks?.map((data, index) => {
                                return (
                                    <span>
                                        {data?.drinksName}{" "}
                                        {cData?.config?.drinks?.length === index + 1 ? "" : ","}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-2"></div>
        </li>
    );
}

export default MainCartList;
