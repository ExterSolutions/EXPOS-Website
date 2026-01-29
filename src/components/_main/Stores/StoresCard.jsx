import React, { useContext } from "react";
import mapMarker from "../../../assets/images/map-maker.png";
import { useNavigate } from "react-router-dom";
import {GlobalContext} from "../../../context/GlobalContext";
import { useSelector } from "react-redux";

const Card = ({
    storeName,
    code,
    storeCity,
    address,
    isActive,
    storeDistance,
    onCardClick,
    isBtnSelected,
    setCurrentStoreCode,
    setCurrentStore,
    setCurrentCity,
    storeLocationByCity,
    currentLatitude,
    currentLogitude,
    isNearestStore,
    setCurrentLatitude,
    setCurrentLogitude
}) => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [cart, setCart] = globalCtx.cart;
    const { user } = useSelector((state) => state);

    const handleStartOrder = (e) => {
        e.preventDefault();
        if (isBtnSelected) {
            if (cart?.product?.length > 0) {
                if (isAuthenticated && user !== null) {
                    navigate("/checkout");
                } else {
                    localStorage.setItem("redirectTo", '/checkout');
                    navigate("/login");
                }
            } else {
                navigate("/menu");
            }
        } else {
            const city = storeLocationByCity.find((data) => data?.city === storeCity);
            const cityOption = {
                value: city.city,
                label: city.city,
                stores: city.storeLocations,
            };
            const storeOptions = cityOption?.stores?.map((store) => ({
                value: store.code,
                label: store.storeLocation,
            }));
            const storeOption = storeOptions.find((store) => store.value === code);

            setCurrentCity(cityOption);
            setCurrentStoreCode(code);
            setCurrentStore(storeOption);

            localStorage.setItem('currentStore', JSON.stringify(storeOption));
            localStorage.setItem('currentCity', JSON.stringify(cityOption));
            localStorage.setItem('currentStoreCode', code);
            setCurrentLatitude(null);
            setCurrentLogitude(null);
            localStorage.setItem('currentLatitude', null);
            localStorage.setItem('currentLogitude', null);

            if (cart?.product?.length > 0) {
                if (isAuthenticated && user !== null) {
                    navigate("/checkout");
                } else {
                    localStorage.setItem("redirectTo", '/checkout');
                    navigate("/login");
                }
            } else {
                navigate("/menu");
            }


        }
    }

    return (
        <div
            className={`card my-1 border-1 rounded-3 ${isActive ? "active-card" : "inactive-card"
                }`}
            onClick={onCardClick}
        >
            <div className="p-3">
                <div className="d-flex align-items-start justify-content-start">
                    <img
                        src={mapMarker}
                        alt="Pizza Icon"
                        className="custom-icon"
                        style={{ width: "24px", height: "24px" }}
                    />
                    <div className="text-start">
                        <div className="storeCardtitle">
                            <span>{storeName}</span>
                        </div>
                        <p className="storeCardcity logo-primary-text-color">{storeCity}</p>
                        <p className="storeCardaddress">{address}</p>
                        {currentLatitude && currentLogitude && (
                            <p className=""><span className="me-2 storeKM ">{storeDistance} KM</span> {isNearestStore === 1 && <span className="badge logo-primary-background-color rounded-pill isNearest">Nearest</span>}</p>
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-start justify-content-end mt-2">
                    {isActive && <>
                        <button className={`btn btn-sm rounded-5 ${isBtnSelected ? 'selectedStartOrderBtn' : 'startOrderBtn'}  `} onClick={handleStartOrder}>Start Your Order</button>
                    </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Card;
