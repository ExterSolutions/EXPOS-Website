import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {GlobalContext} from '../../../../context/GlobalContext';

export const useStorePopup = () => {
    const globalCtx = useContext(GlobalContext);
    const [currentStoreCode] = globalCtx.currentStoreCode;
    const [currentCity] = globalCtx.currentCity;
    const [currentStore] = globalCtx.currentStore;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const location = useLocation();

    useEffect(() => {
        if (!currentStoreCode || !currentCity || !currentStore) {
            if (location.pathname === "/") {
                setShowStorePopup(true);
            }
        }
    }, [currentStoreCode, currentCity, currentStore, location.pathname]);

   
    useEffect(() => {
        const showPopupAfterLogin = localStorage.getItem('showPopupAfterLogin') === 'true';
        const showOrderNowPopupAfterLogin = localStorage.getItem('showOrderNowPopupAfterLogin') === 'true';
        
        if (showPopupAfterLogin && location.pathname === "/") {
            setShowStorePopup(true);
            localStorage.removeItem('showPopupAfterLogin');
            localStorage.removeItem('forceShowOrderMethodPopup');
        } else if (showOrderNowPopupAfterLogin && location.pathname === "/") {
            setShowStorePopup(true);
            localStorage.removeItem('showOrderNowPopupAfterLogin');
        }
    }, [location.pathname]);

    return {
        showStorePopup,
        setShowStorePopup
    };
};