import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {GlobalContext} from '../../../../context/GlobalContext';

export const useOrderNow = () => {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated] = globalCtx.auth;
    const [cart] = globalCtx.cart;
    const [currentStore] = globalCtx.currentStore;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const user = useSelector((state) => state.user);

    const handleOrderNowClick = (e) => {
        e.preventDefault();
        if (cart?.product?.length > 0) {
            // Check if we need to force show order method popup after payment
            const forceShowPopup = localStorage.getItem('forceShowOrderMethodPopup') === 'true';
            if (forceShowPopup) {
                setShowStorePopup(true);
                localStorage.removeItem('forceShowOrderMethodPopup');
                return;
            }
            if (isAuthenticated && user) {
                localStorage.setItem('orderNowFlow', 'true');
                setShowStorePopup(true);
            } else {
                localStorage.setItem("redirectTo", "/checkout");
                navigate("/login");
            }
        } else {
            currentStore ? navigate("/menu") : setShowStorePopup(true);
        }
    };

    return {
        handleOrderNowClick
    };
};