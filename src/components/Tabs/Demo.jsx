import { useLocation, useNavigate } from "react-router-dom";

const Tabs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="special-offer-inr-block new-block">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 pd0 BgsecondaryBlackColor">
                            <div className="special-offer-block ol_flr new-block">
                                <ul
                                    className="cat-sec nav nav-tabs d-flex"
                                    role="tablist"
                                >

                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/create-your-own")}
                                            aria-controls="home"
                                            aria-selected="true"
                                            data-bs-target="#createYourOwn"
                                            data-bs-toggle="tab"
                                            className="block-stl1 bg1 nav-link active "
                                            id="createyourown-tab"
                                            type="button"
                                            role="tab"
                                            style={{ backgroundColor: `${location.pathname === "/create-your-own" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Create Your Own</span>
                                        </button>
                                    </li>


                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/specialoffer")}
                                            className="block-stl1 bg1 nav-link btn"
                                            id="specialoffer-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#specialoffer"
                                            type="button"
                                            role="tab"
                                            aria-controls="specialoffer"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/specialoffer" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Deals</span>
                                        </button>
                                    </li>


                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/signaturepizza")}
                                            className="block-stl1 bg1 nav-link btn"
                                            id="signature-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#signature"
                                            type="button"
                                            role="tab"
                                            aria-controls="signature"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/signaturepizza" ? "#v" : "#f29640"}` }}
                                        >
                                            <span>Signature Pizzas</span>
                                        </button>
                                    </li>

                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/otherpizza")}
                                            className="block-stl1 bg1 nav-link btn"
                                            id="other-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#other"
                                            type="button"
                                            role="tab"
                                            aria-controls="other"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/otherpizza" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Other Pizzas</span>
                                        </button>
                                    </li>

                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/sides")}
                                            data-bs-target="#sides"
                                            data-bs-toggle="tab"
                                            className="block-stl1 bg1 nav-link btn"
                                            id="sides-tab"
                                            type="button"
                                            role="tab"
                                            aria-controls="sides"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/sides" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Sides</span>
                                        </button>
                                    </li>


                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/dips")}
                                            data-bs-target="#dips"
                                            data-bs-toggle="tab"
                                            className="block-stl1 bg1 nav-link btn"
                                            id="dips-tab"
                                            type="button"
                                            role="tab"
                                            aria-controls="dips"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/dips" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Dips</span>
                                        </button>
                                    </li>

                                    <li className="nav-item cat-block d-flex justify-content-center aling-items-center">
                                        <button
                                            onClick={() => navigate("/drinks")}
                                            data-bs-target="#drinks"
                                            data-bs-toggle="tab"
                                            className="block-stl1 bg1 nav-link btn"
                                            id="drinks-tab"
                                            type="button"
                                            role="tab"
                                            aria-controls="drinks"
                                            aria-selected="false"
                                            style={{ backgroundColor: `${location.pathname === "/drinks" ? "#f26724" : "#f29640"}` }}
                                        >
                                            <span>Drinks</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Tabs;