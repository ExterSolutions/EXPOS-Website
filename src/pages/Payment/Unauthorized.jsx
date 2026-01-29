import React from "react";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
    const navigate = useNavigate();
    return (
        <div className="container-fluid row m-0 p-0 px-3 d-flex justify-content-center">
            <div className="card py-2 my-4 col-lg-5 col-md-7 col-sm-10 text-center">
                <div className="card-body">
                    <p
                        className="cart-text text-danger my-1"
                        style={{ fontSize: "1rem" }}
                    >
                        <span>UnAuthorized Page</span>
                    </p>
                </div>
                <div className="card-footer bg-transparent">
                    <button
                        onClick={() => {
                            navigate("/");
                        }}
                        className="btn btn-sm bg-secondary text-light"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;
