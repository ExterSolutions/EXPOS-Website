import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header/Header'
// import Tabs from '../../Tabs/Tabs'
import Footer from '../Footer'
import CustomizeDrinkContent from './CustomizeDrinkContent'
import { getDrinks, settingApi } from '../../../services'
import {GlobalContext} from '../../../context/GlobalContext'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import CartFunction from '../../cart'
import { useSelector } from 'react-redux'

function CustomizeDrinks() {
    const [loading, setLoading] = useState(true)
    const [drinkData, setDrinkData] = useState(null)
    // Global Context
    const globalCtx = useContext(GlobalContext);
    const [cart, setCart] = globalCtx.cart;
    const [settings, setSettings] = globalCtx.settings;
    const [currentStoreCode, setCurrentStoreCode] = globalCtx.currentStoreCode;
    const [showStorePopup, setShowStorePopup] = globalCtx.showStorePopup;
    const user = useSelector((state) => state.user);
    const cartFn = new CartFunction();
    const { did } = useParams();
    // 
    const fetchData = async () => {
        setLoading(true);
        try {
            const [drinksResponse, settingsResponse] = await Promise.all([
                getDrinks(),
                settingApi(),
            ]);
            // Process drinks response
            const selectedObject = drinksResponse.data.find(
                (data) => data?.softdrinkCode === did
            );
            setDrinkData(selectedObject);
            setSettings(settingsResponse.data);
            setLoading(false);
        } catch (err) {
            if (
                err.response &&
                (err.response.status === 400 || err.response.status === 500)
            ) {
                toast.error(err.response.data.message);
            } else {
                console.error("Error fetching data:", err);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header />
            <div className='nav-margin'></div> 
            <CustomizeDrinkContent loading={loading} drinkData={drinkData} settings={settings} user={user} cartFn={cartFn} setCart={setCart} currentStoreCode={currentStoreCode} setShowStorePopup={setShowStorePopup} />
            <Footer />
        </>
    )
}

export default CustomizeDrinks