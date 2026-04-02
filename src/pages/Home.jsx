// src/pages/Home.jsx - UPDATED VERSION
import React, { useContext, useEffect, useState, lazy } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "../components/cart";
import { getDynamicSlider, getDynamicSlidersImage, getHomePizzas, settingApi, getSpecialOffersWithToppingsList } from "../services";
import { toast } from "react-toastify";
import PizzaCarousel from "../components/_main/Carousel/PizzaCarousel";
import LoadingLayout from "../layouts/LoadingLayout";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryPizza from "./Categories/CategoryPizza";

const Home = () => {
    const [loading, setLoading] = useState(true);

    // Global Context - WITH SAFE ACCESS
    const globalctx = useContext(GlobalContext);

    // Check if context is available
    if (!globalctx) {
        console.error("GlobalContext is not available in Home component");
        return <LoadingLayout message="Loading context..." />;
    }

    // Safely destructure with defaults
    const cartContext = globalctx.cart || [{ product: [] }, () => { }];
    const urlPathContext = globalctx.urlPath || [null, () => { }];
    const settingsContext = globalctx.settings || [null, () => { }];
    const selectedTypeContext = globalctx.selectedType || ["delivery", () => { }];
    const scrollToSignatureContext = globalctx.scrollToSignature || [false, () => { }];

    const [cart, setCart] = cartContext;
    const [url, setUrl] = urlPathContext;
    const [settings, setSettings] = settingsContext;
    const [selectedType, setSelectedType] = selectedTypeContext;
    const [scrollToSignature, setScrollToSignature] = scrollToSignatureContext;

    const [otherPizzaList, setOtherPizzaList] = useState(null);
    const [PopulerPizzaList, setPopulerPizzaList] = useState(null);
    const [specialOfferList, setSpecialOfferList] = useState(null);
    const [specialPizzaWithToppings, setSpecialPizzaWithToppings] = useState(null);
    const [signaturePizzaList, setSignaturePizzaList] = useState(null);
    const [offerCards, setOfferCards] = useState([]);
    const [getSlider, setGetSlider] = useState([]);
    const [sliderDataNew, setSliderDataNew] = useState([]);

    const location = useLocation();
    const cartFn = new CartFunction();

    useEffect(() => {
        if (setCart) {
            cartFn.createCart(setCart);
        }
    }, [setCart]);

    useEffect(() => {
        if (setUrl) {
            setUrl(location?.pathname);
        }
    }, [location, setUrl]);

    useEffect(() => {
        if (!selectedType && setSelectedType) {
            setSelectedType('delivery');
            localStorage.setItem('selectedType', 'delivery');
        }
    }, [selectedType, setSelectedType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [getHomePizzasResponse, sliderData, getDynamicSliderResponse, specialWithToppingsResponse] = await Promise.all([
                getHomePizzas(),
                getDynamicSlider(),
                getDynamicSlidersImage(),
                getSpecialOffersWithToppingsList(),
            ]);

            setOtherPizzaList(getHomePizzasResponse?.data?.otherPizzas);
            setSpecialOfferList(getHomePizzasResponse?.data?.specialPizzas);
            setSignaturePizzaList(getHomePizzasResponse?.data?.signaturePizzas);
            setOfferCards(getHomePizzasResponse?.data?.offerCards);
            setSpecialPizzaWithToppings(specialWithToppingsResponse?.data || []);
            setGetSlider(sliderData?.data);
            setSliderDataNew(getDynamicSliderResponse?.data?.filter((data) => data?.code !== "static"));

            const rawPopularItems = getHomePizzasResponse?.data?.popularItems || [];

            // Only signatures + up to 3 sides; exclude drinks, dips, other
            const signatureItems = rawPopularItems
                .filter(item => item.productType === "signature")
                .map(item => ({
                    ...item,
                    pizzaName: item.name,
                    pizzaImage: item.image,
                    pizzaSubtitle: null,
                    ratings: item.ratings,
                    code: item.code,
                    // Price: first pizza_prices entry
                    displayPrice: item?.pizza_prices?.[0]?.price ?? null,
                }));

            const sideItems = rawPopularItems
                .filter(item => item.productType === "sides")
                .slice(0, 3)
                .map(item => ({
                    ...item,
                    pizzaName: item.sideName || item.name,
                    pizzaImage: item.image,
                    pizzaSubtitle: null,
                    ratings: item.ratings,
                    code: item.code,
                    // Price: cheapest combination entry
                    displayPrice: item?.combination?.[0]?.price ?? null,
                }));

            const filteredPopularPizzas = [...signatureItems, ...sideItems];
            setPopulerPizzaList(filteredPopularPizzas);
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message || 'An error occurred while fetching data.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (setSettings) {
            settingApi()
                .then((res) => {
                    setSettings(res.data);
                })
                .catch((err) => {
                    if (err.response?.status === 400 || err.response?.status === 500) {
                        toast.error(err.response.data.message);
                    }
                });
        }
        fetchData();
    }, [setSettings]);

    useEffect(() => {
        if (!loading) {
            AOS.init({ duration: 1000 });
        }
    }, [loading]);

    if (loading) return <LoadingLayout />;

    return (
        <div>
            <Header />
            <div className="inner-nav"></div>
            <div className="container-fluid container-lg px-0">
                <CategoryPizza />
                {/* Offer Cards hidden — big image banners replaced by card carousels */}
                {/* <OfferCards offers={offerCards} /> */}
                <PizzaCarousel sectionSubTitle={`🔥 Craving Something Delicious?`} sectionTitle={`Top Deals`} pizzas={specialOfferList} type="special" redirectBase={'/specialoffer'} />
                <PizzaCarousel sectionSubTitle={`Chef's Selection`} sectionTitle={`Special + Toppings`} pizzas={specialPizzaWithToppings} type="special" redirectBase={'/special-offers-with-toppings'} />
                <PizzaCarousel sectionSubTitle={`Choose your Flavour`} sectionTitle={`Signature Pizzas`} pizzas={signaturePizzaList} type="signature" redirectBase={'/signaturepizza'} />
                <PizzaCarousel sectionSubTitle={`Our Customers Love These`} sectionTitle={`Best Sellers`} pizzas={PopulerPizzaList} type="menu" redirectBase={'/menu'} showBestSelling={true} />
            </div>
            <div className="container-fluid px-0">
                {/* <DownloadSection /> */}
                <Footer showOnMobile />
            </div>
        </div>
    );
};

export default Home;