import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { specialIngredients } from "../../services";
import pizzaImage from "../../assets/images/pz.png";
import LoadingLayout from "../../layouts/LoadingLayout";

function SpecialMenuList() {
    const [specialData, setSpecialData] = useState();
    const [loading, setLoading] = useState(true);

    const specialIngredient = async () => {
        setLoading(true)
        await specialIngredients()
            .then((res) => {
                setSpecialData(res.data);
                setLoading(false)
            })
            .catch((err) => {
            }).finally(() => {
                setLoading(false)
            });
    };

    useEffect(() => {
        specialIngredient();
    }, []);

    return (
        <>
            {loading ? (<LoadingLayout />) : (<div className="row gx-4 pt-4 mt-5 mb-5 position-relative px-4">
                {specialData?.map((data) => {
                    if (Number(data?.showOnClient) === 1) {
                        return (
                            <div
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3"
                                key={data.code}
                            >
                                <div className="d-flex justify-content-center flex-column p-3 box bgPrimaryBlackColor">
                                    {data?.dealType !== "other" && (
                                        <div className="highlightedContent">
                                            <span className="rounded">{data?.dealType}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-center mb-3">
                                        <div className="image-div d-flex justify-content-center">
                                            <img
                                                src={data.image ? data.image : pizzaImage}
                                                alt=""
                                                className="img-fluid image"
                                            />
                                        </div>
                                    </div>
                                    <div className="sidesTitle mb-3 text-center">
                                        <h3
                                            className="mb-1 text-truncate primaryWhiteColor"
                                            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                                        >
                                            {data.name}
                                        </h3>
                                        {data?.subtitle ? (
                                            <>
                                                <p
                                                    className={`sppizzasize mb-2 text-truncate ${data?.dealType === "pickupdeal"
                                                        ? "pickup-deal-style"
                                                        : ""
                                                        }`}
                                                    style={{
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        color: "#dd6b00",
                                                    }}
                                                >
                                                    {data?.subtitle}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p
                                                    className="sppizzasize mb-2 text-truncate"
                                                    style={{
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        color: "#dd6b00",
                                                    }}
                                                >
                                                    &nbsp;
                                                </p>
                                            </>
                                        )}
                                        {/* <p className="sppizzasize text-secondary mb-2">
                  Size : <span className="mx-2">Large / Extra Large</span>
                </p> */}
                                        <p className="sppizzaPrice text-dark mb-2 primaryWhiteColor">
                                            Price :{" "}
                                            <span className="mx-2">
                                                ${" "}
                                                {Number(data.largePizzaPrice)?.toFixed(2) !==
                                                    Number(0).toFixed(2)
                                                    ? Number(data.largePizzaPrice)?.toFixed(2)
                                                    : Number(data.extraLargePizzaPrice)?.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="d-flex `justify-content-center flex-column align-items-center">
                                        <Link
                                            to={`/special-pizza/${data.code}`}
                                            className="customizedBtn btn btn-sm px-4 py-2 text-white"
                                        >
                                            Customize
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div >)
            }
        </>
    );
}

export default SpecialMenuList;
