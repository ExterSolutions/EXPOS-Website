
function ViewOrderProductDetails({ orderData }) {
    return (
        <>
            {/* Product Details */}
            <div className="col-12 text-start headingTitle mt-3">
                <h4>
                    <strong>Product Details</strong>
                </h4>
            </div>
            <div className="col-12 mx-1 mt-3 py-2">
                <div className="w-100 mainDiv">
                    <div className="bg-light w-auto py-2 d-flex justify-content-around productDetails">
                        <div className="text-start fw-bold products mx-1">Products</div>
                        <div className="text-center fw-bold qty mx-1">Quantity</div>
                        <div className="text-end fw-bold amount mx-1">Amount</div>
                    </div>

                    {orderData?.orderItems && orderData?.orderItems?.length > 0 ? (
                        orderData?.orderItems?.map((order, index) => {
                            return (
                                <>
                                    <div className="w-auto py-1 d-flex justify-content-around productDetails contentDiv">
                                        <div
                                            className="products d-flex justify-content-start mx-1"
                                            key={order?.id}
                                        >
                                            <span className="productName p-0">
                                                {order?.productName} {order?.productType === "special_pizza" ||
                                                    order?.productType === "custom_pizza" || order?.productType === "signature_pizza" || order?.productType === "other_pizza"
                                                    ? `(${order?.pizzaSize})`
                                                    : ''}
                                            </span>
                                        </div>
                                        <div
                                            className="text-center orderSummaryText qty mx-1"
                                            key={order?.id}
                                        >
                                            {order?.quantity}
                                        </div>
                                        <div
                                            className="text-end orderSummaryText amount mx-1"
                                            key={order?.id}
                                        >
                                            {order?.productType === "special_pizza" ||
                                                order?.productType === "custom_pizza" || order?.productType === "signature_pizza" || order?.productType === "other_pizza"
                                                ? isNaN(order?.pizzaPrice * order?.quantity) ? "-" : "$ " + (order?.pizzaPrice * order?.quantity)
                                                : isNaN(order?.amount) ? "-" : "$ " + order?.amount}
                                        </div>
                                    </div>

                                    {order?.productType === "side" && (
                                        <div className="w-auto d-flex justify-content-around productDetails">
                                            <div
                                                className="products d-flex justify-content-start mx-1"
                                                key={order?.id}
                                            >
                                                <span className="subText">
                                                    {order?.config?.sidesSize}
                                                </span>
                                            </div>
                                            <div className="text-center qty mx-1" key={order?.id}>
                                                {" "}
                                            </div>
                                            <div
                                                className="text-end amount mx-1"
                                                key={order?.id}
                                            >
                                                {" "}
                                            </div>
                                        </div>
                                    )}

                                    {(order?.productType === "side" ||
                                        order?.productType === "dips" ||
                                        order?.productType === "drinks") && order?.comments !== "" && (
                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                <div
                                                    className="products d-flex justify-content-start mx-1"
                                                    key={order?.id}
                                                >
                                                    <span className="subText">
                                                        <strong>Comments : </strong>
                                                        {order?.comments}
                                                    </span>
                                                </div>
                                                <div className="text-center qty mx-1" key={order?.id}>
                                                    {" "}
                                                </div>
                                                <div
                                                    className="text-end amount mx-1"
                                                    key={order?.id}
                                                >
                                                    {" "}
                                                </div>
                                            </div>
                                        )}

                                    {(order?.productType === "custom_pizza" || order?.productType === "special_pizza" || order?.productType === "signature_pizza" || order?.productType === "other_pizza") &&
                                        order?.config?.pizza?.map((data, index) => {
                                            return (
                                                <>
                                                    {/* Pizza Name Header */}
                                                    {order?.productType === "special_pizza" && (
                                                        <div className="w-auto d-flex justify-content-around productDetails">
                                                            <div className="products d-flex justify-content-start mx-1">
                                                                <span className="subText fw-Bold">
                                                                    <strong>Pizza {index + 1}: {data?.signaturePizzaName}</strong>
                                                                </span>
                                                            </div>
                                                            <div className="text-center qty mx-1"> </div>
                                                            <div className="text-end amount mx-1"></div>
                                                        </div>
                                                    )}

                                                    {/* Crust */}
                                                    {data?.crust &&
                                                        data?.crust?.crustName !== "Regular" && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText fw-Bold">
                                                                        <strong>Crust :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.crust?.crustName}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.crust?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.crust?.price) !== 0
                                                                            ? "$ " + data?.crust?.price * order?.quantity
                                                                            : ""}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Crust Type */}
                                                    {data?.crustType &&
                                                        data?.crustType?.crustType !== "Regular" && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText fw-Bold">
                                                                        <strong>Crust Type :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.crustType?.crustType}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.crustType?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.crustType?.price) !== 0
                                                                            ? "$ " + data?.crustType?.price * order?.quantity
                                                                            : ""}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Cheese */}
                                                    {data?.cheese &&
                                                        data?.cheese?.cheeseName !== "Mozzarella" && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Cheese :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.cheese?.cheeseName}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.cheese?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.cheese?.price) !== 0
                                                                            ? "$ " + data?.cheese?.price * order?.quantity
                                                                            : ""}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Specialbases */}
                                                    {data?.specialBases &&
                                                        (Object.keys(data?.specialBases).length !== 0 ||
                                                            data?.specialBases?.length !== 0) && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Specialbases :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.specialBases?.specialbaseName}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.specialBases?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.specialBases?.price) !== 0
                                                                            ? "$ " + data?.specialBases?.price * order?.quantity
                                                                            : ""}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Spicy */}
                                                    {data?.spicy &&
                                                        data?.spicy?.spicy !== "Regular" && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Spicy :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.spicy?.spicy}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.spicy?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.spicy?.price) !== 0
                                                                            ? "$ " + data?.spicy?.price * order?.quantity
                                                                            : ""}{" "}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Sauce */}
                                                    {data?.sauce &&
                                                        data?.sauce?.sauce !== "Regular" && (
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Sauce :</strong>
                                                                    </span>
                                                                    <span className="subText mx-2">
                                                                        {data?.sauce?.sauce}
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1">
                                                                    {" "}
                                                                </div>
                                                                <div className="text-end amount mx-1">
                                                                    {isNaN(Number(data?.sauce?.price) * order?.quantity)
                                                                        ? "-"
                                                                        : Number(data?.sauce?.price) !== 0
                                                                            ? "$ " + data?.sauce?.price * order?.quantity
                                                                            : ""}{" "}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Cook */}
                                                    {data?.cook && data?.cook?.cook !== "Regular" && (
                                                        <div className="w-auto d-flex justify-content-around productDetails">
                                                            <div className="products d-flex justify-content-start mx-1">
                                                                <span className="subText">
                                                                    <strong>Cook :</strong>
                                                                </span>
                                                                <span className="subText mx-2">
                                                                    {data?.cook?.cook}
                                                                </span>
                                                            </div>
                                                            <div className="text-center qty mx-1"> </div>
                                                            <div className="text-end amount mx-1">
                                                                {isNaN(Number(data?.cook?.price) * order?.quantity)
                                                                    ? "-"
                                                                    : Number(data?.cook?.price) !== 0
                                                                        ? "$ " + data?.cook?.price * order?.quantity
                                                                        : ""}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Toppings */}
                                                    {(data?.toppings?.countAsTwoToppings.length > 0 ||
                                                        data?.toppings?.countAsOneToppings.length > 0 ||
                                                        data?.toppings?.freeToppings.length > 0) && (
                                                            <>
                                                                <div className="w-auto d-flex justify-content-around productDetails">
                                                                    <div className="products d-flex justify-content-start mx-1">
                                                                        <span className="subText">
                                                                            <strong>Toppings :</strong>
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-center qty mx-1">
                                                                        {" "}
                                                                    </div>
                                                                    <div className="text-end amount mx-1">
                                                                        {" "}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                    {data?.toppings?.countAsTwoToppings &&
                                                        data?.toppings?.countAsTwoToppings?.length >
                                                        0 && (
                                                            <>
                                                                <ToppingsDetails
                                                                    tpsDetails={
                                                                        data?.toppings?.countAsTwoToppings
                                                                    }
                                                                    count={2}
                                                                    orderQuantity={order?.quantity}
                                                                />
                                                            </>
                                                        )}

                                                    {data?.toppings?.countAsOneToppings &&
                                                        data?.toppings?.countAsOneToppings?.length >
                                                        0 && (
                                                            <>
                                                                <ToppingsDetails
                                                                    tpsDetails={
                                                                        data?.toppings?.countAsOneToppings
                                                                    }
                                                                    count={1}
                                                                    orderQuantity={order?.quantity}
                                                                />
                                                            </>
                                                        )}

                                                    {data?.toppings?.freeToppings &&
                                                        data?.toppings?.freeToppings?.length > 0 && (
                                                            <>
                                                                {data?.isAllIndiansTps ===
                                                                    true ? (
                                                                    <>
                                                                        <div className="w-auto d-flex justify-content-around productDetails">
                                                                            <div className="products d-flex justify-content-start mx-1">
                                                                                <span className="subText">
                                                                                    <strong>
                                                                                        Indian Style + Coriander
                                                                                    </strong>
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-center qty mx-1">
                                                                                {" "}
                                                                            </div>
                                                                            <div className="text-end amount mx-1">
                                                                                {" "}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <ToppingsDetails
                                                                        tpsDetails={
                                                                            data?.toppings?.freeToppings
                                                                        }
                                                                        count={0}
                                                                        orderQuantity={order?.quantity}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    {index < order?.config?.pizza?.length - 1 && (
                                                        <hr
                                                            className="m-0 p-0 my-2"
                                                            style={{
                                                                border: "none",
                                                                borderTop: "1px dashed #ccc",
                                                                opacity: "0.5",
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            );
                                        })}


                                    {(order?.productType === "custom_pizza" ||
                                        order?.productType === "special_pizza") && (
                                            <>
                                                {(order?.config?.sides?.length > 0 || order?.config?.dips?.length > 0 || order?.config?.drinks?.length > 0) && (
                                                    <hr className="my-2" />
                                                )}
                                                {order?.config?.sides &&
                                                    order?.config?.sides.length > 0 && (
                                                        <>
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Sides :</strong>
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1"> </div>
                                                                <div className="text-end amount mx-1">
                                                                    {" "}
                                                                </div>
                                                            </div>
                                                            {order?.config?.sides?.map((data, index) => {
                                                                return (
                                                                    <div className="w-auto d-flex justify-content-around productDetails">
                                                                        <div className="products d-flex justify-content-start mx-1">
                                                                            <span className="subText">
                                                                                {data?.sideName} ( {data?.sideSize} )
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-center qty mx-1">
                                                                            {isNaN(data?.quantity * order?.quantity) ? "-" : data?.quantity * order?.quantity}
                                                                        </div>
                                                                        <div className="text-end amount mx-1">
                                                                            {isNaN(Number(data?.totalPrice) * order?.quantity)
                                                                                ? "-"
                                                                                : Number(data?.totalPrice) !== 0
                                                                                    ? "$ " + data?.totalPrice * order?.quantity
                                                                                    : ""}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </>
                                                    )}

                                                {order?.config?.dips &&
                                                    order?.config?.dips.length > 0 && (
                                                        <>
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Dips :</strong>
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1"> </div>
                                                                <div className="text-end amount mx-1">
                                                                    {" "}
                                                                </div>
                                                            </div>
                                                            {order?.config?.dips?.map((data, index) => {
                                                                return (
                                                                    <div className="w-auto d-flex justify-content-around productDetails">
                                                                        <div className="products d-flex justify-content-start mx-1">
                                                                            <span className="subText">
                                                                                {data?.dipsName}{" "}
                                                                                {order?.config?.dips.length - 1 ===
                                                                                    index
                                                                                    ? ""
                                                                                    : ","}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-center qty mx-1">
                                                                            {order?.productType === 'special_pizza' ?
                                                                                <>
                                                                                    {data?.paidQuantity > 0
                                                                                        ? (isNaN(data?.freeQuantity * order?.quantity) || isNaN(data?.paidQuantity * order?.quantity)) ? "-" : `(${data?.freeQuantity * order?.quantity} + ${data?.paidQuantity * order?.quantity})`
                                                                                        : isNaN(data?.freeQuantity * order?.quantity) ? "-" : `${data?.freeQuantity * order?.quantity}`
                                                                                    }
                                                                                </> : isNaN(data?.quantity) ? "-" : data?.quantity
                                                                            }
                                                                        </div>
                                                                        <div className="text-end amount mx-1">
                                                                            {isNaN(Number(data?.totalPrice) * order?.quantity)
                                                                                ? "-"
                                                                                : Number(data?.totalPrice) !== 0
                                                                                    ? "$ " + data?.totalPrice * order?.quantity
                                                                                    : ""}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </>
                                                    )}

                                                {order?.config?.drinks &&
                                                    order?.config?.drinks.length > 0 && (
                                                        <>
                                                            <div className="w-auto d-flex justify-content-around productDetails">
                                                                <div className="products d-flex justify-content-start mx-1">
                                                                    <span className="subText">
                                                                        <strong>Drinks :</strong>
                                                                    </span>
                                                                </div>
                                                                <div className="text-center qty mx-1"> </div>
                                                                <div className="text-end amount mx-1">
                                                                    {" "}
                                                                </div>
                                                            </div>
                                                            {order?.config?.drinks?.map((data, index) => {
                                                                return (
                                                                    <div className="w-auto d-flex justify-content-around productDetails">
                                                                        <div className="products d-flex justify-content-start mx-1">
                                                                            <span className="subText">
                                                                                {data?.drinksName}
                                                                                {order?.config?.drinks.length - 1 ===
                                                                                    index
                                                                                    ? ""
                                                                                    : ","}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-center qty mx-1">
                                                                            {isNaN(data?.quantity * order?.quantity) ? "-" : data?.quantity * order?.quantity}
                                                                        </div>
                                                                        <div className="text-end amount mx-1">
                                                                            {isNaN(Number(data?.totalPrice) * order?.quantity)
                                                                                ? "-"
                                                                                : Number(data?.totalPrice) !== 0
                                                                                    ? "$ " + data?.totalPrice * order?.quantity
                                                                                    : ""}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                            </>
                                        )}

                                    {(order?.productType === "custom_pizza" ||
                                        order?.productType === "special_pizza" || order?.productType === "signature_pizza" || order?.productType === "other_pizza") &&
                                        order?.comments !== "" && (
                                            <>
                                                <div className="w-auto d-flex justify-content-around productDetails">
                                                    <div
                                                        className="products d-flex justify-content-start mx-1"
                                                        key={order?.id}
                                                    >
                                                        <span className="subText">
                                                            <strong>Comments : </strong>
                                                            {order?.comments}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-center qty mx-1"
                                                        key={order?.id}
                                                    >
                                                        {" "}
                                                    </div>
                                                    <div
                                                        className="text-end amount mx-1"
                                                        key={order?.id}
                                                    >
                                                        {" "}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    <hr
                                        className="m-0 p-0 my-3"
                                        style={{
                                            border: "none",
                                            height: "2px",
                                            backgroundColor: "#002d5b",
                                            opacity: "0.8",
                                        }}
                                    />
                                </>
                            );
                        })
                    ) : (
                        <>
                            <div className="w-100 text-center fw-bold amount">
                                No Data Found
                            </div>
                        </>
                    )}

                    <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                        <div className="text-end orderSummaryTitle fw-bold subTotal" style={{ width: "300px" }}>
                            Sub Total :
                        </div>
                        <div className="text-end amount ms-4" style={{ width: "100px" }}>
                            <span className="orderSummaryText">
                                $ {orderData?.subTotal}
                            </span>
                        </div>
                    </div>
                    {Number(orderData?.discountAmount || 0) > 0 && (
                        <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                            <div className="text-end orderSummaryTitle fw-bold text-success" style={{ width: "300px" }}>
                                Discount ({orderData?.coupon_code}) :
                            </div>
                            <div className="text-end orderSummaryText fw-bold text-success amount ms-4" style={{ width: "100px" }}>
                                - $ {orderData?.discountAmount}
                            </div>
                        </div>
                    )}

                    {Number(orderData?.taxAmount || 0) > 0 && (
                        <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                            <div className="text-end orderSummaryTitle fw-bold taxAmount" style={{ width: "300px" }}>
                                Tax Amount ({orderData?.taxPer} %) :
                            </div>
                            <div className="text-end orderSummaryText fw-bold amount ms-4" style={{ width: "100px" }}>
                                $ {orderData?.taxAmount}
                            </div>
                        </div>
                    )}

                    {Number(orderData?.convinenceCharges || 0) > 0 && (
                        <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                            <div className="text-end orderSummaryTitle fw-bold convenienceCharge" style={{ width: "300px" }}>
                                Convenience Charges ({orderData?.convinencePer} %) :
                            </div>
                            <div className="text-end orderSummaryText fw-bold amount ms-4" style={{ width: "100px" }}>
                                $ {orderData?.convinenceCharges}
                            </div>
                        </div>
                    )}

                    {Number(orderData?.deliveryCharges || 0) > 0 && (
                        <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                            <div className="text-end fw-bold orderSummaryTitle deliveryCharge" style={{ width: "300px" }}>
                                Delivery Charges :
                            </div>
                            <div className="text-end orderSummaryText fw-bold amount ms-4" style={{ width: "100px" }}>
                                $ {orderData?.deliveryCharges}
                            </div>
                        </div>
                    )}

                    {Number(orderData?.extraDeliveryCharges || 0) > 0 && (
                        <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails pe-4">
                            <div className="text-end fw-bold orderSummaryTitle deliveryCharge" style={{ width: "300px" }}>
                                Extra Delivery Charges :
                            </div>
                            <div className="text-end orderSummaryText fw-bold amount ms-4" style={{ width: "100px" }}>
                                $ {orderData?.extraDeliveryCharges}
                            </div>
                        </div>
                    )}

                    <div className="bg-light w-100 py-2 d-flex justify-content-end productDetails border-top pe-4">
                        <div className="text-end fw-bold orderSummaryTitle grandTotal" style={{ width: "300px" }}>
                             Grand Total :
                        </div>
                        <div className="text-end orderSummaryText fw-bold amount ms-4" style={{ width: "100px" }}>
                            $ {orderData?.grandTotal}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ViewOrderProductDetails

export const ToppingsDetailsForSpecial = ({ tpsDetails }) => {
    return (
        <>
            {tpsDetails?.map((data) => {
                return (
                    <>
                        <div className="w-auto d-flex justify-content-around productDetails" key={data?.code}>
                            <div className="products d-flex justify-content-start mx-1">
                                (<span className="subText px-1">{data?.count}</span>)
                                <span className="subText mx-1">{data?.name} </span>
                            </div>
                            <div className="text-center qty mx-1"> </div>
                            <div className="text-end amount mx-1">
                            </div>
                        </div>
                    </>
                );
            })}
        </>
    );
};


export const ToppingsDetails = ({ tpsDetails, count, orderQuantity }) => {
    return (
        <>
            {tpsDetails?.map((data) => {
                return (
                    <>
                        <div className="w-auto d-flex justify-content-around productDetails">
                            <div className="products d-flex justify-content-start mx-1">
                                {count === 2 ? (
                                    <>
                                        (<span className="subText px-1">2</span>)
                                    </>
                                ) : (
                                    ""
                                )}
                                <span className="subText mx-1">{data?.toppingsName} </span>
                                <strong>
                                    <span className="subText">
                                        (
                                        {data.toppingsPlacement === "whole"
                                            ? "W"
                                            : data.toppingsPlacement === "lefthalf"
                                                ? "L"
                                                : data.toppingsPlacement === "1/4"
                                                    ? "1/4"
                                                    : "R"}
                                        )
                                    </span>
                                </strong>
                            </div>
                            <div className="text-center qty mx-1"> </div>
                            <div className="text-end amount mx-1">
                                {isNaN(Number(data?.amount) * orderQuantity)
                                    ? "-"
                                    : Number(data?.amount) !== undefined &&
                                        Number(data?.amount) !== 0
                                        ? "$ " + Number(data?.amount) * orderQuantity
                                        : ""}
                            </div>
                        </div>
                    </>
                );
            })}
        </>
    );
};