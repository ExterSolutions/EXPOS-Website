import React from "react";
import { Link } from "react-router-dom";

function SPNotFound() {
    return (
        <div className="primary-background-color d-flex w-100 justify-content-center align-items-center flex-column" style={{ minHeight: "calc(100vh - 547px)" }}>
            <p className="mb-3 primaryWhiteColor">PAGE NOT FOUND</p>
            <Link to={"/"} className="btn btn-sm pizza-card-btn-background-color">
                <span className="pizza-card-btn-text-color">BACK TO HOME</span>
            </Link>
        </div>
    );
}

export default SPNotFound;
