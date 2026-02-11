// src/pages/Home.jsx - UPDATED VERSION
import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "../components/cart";
import { getDynamicSlider, getDynamicSlidersImage, getHomePizzas, settingApi } from "../services";
import { toast } from "react-toastify";
import PizzaCarousel from "../components/_main/Carousel/PizzaCarousel";
// import "../assets/styles/theme/theme.css";
// import '../assets/styles/card.css';
import LoadingLayout from "../layouts/LoadingLayout";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryPizza from "./Categories/CategoryPizza";
import OfferCards from "../components/_main/OfferCards";
import DownloadSection from "../components/_main/DownloadSection";

const HeroSliderNew = lazy(() => import('../components/_main/Carousel/HeroSliderNew'));

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
    const cartContext = globalctx.cart || [{ product: [] }, () => {}];
    const urlPathContext = globalctx.urlPath || [null, () => {}];
    const settingsContext = globalctx.settings || [null, () => {}];
    const selectedTypeContext = globalctx.selectedType || ["delivery", () => {}];
    const scrollToSignatureContext = globalctx.scrollToSignature || [false, () => {}];
    
    const [cart, setCart] = cartContext;
    const [url, setUrl] = urlPathContext;
    const [settings, setSettings] = settingsContext;
    const [selectedType, setSelectedType] = selectedTypeContext;
    const [scrollToSignature, setScrollToSignature] = scrollToSignatureContext;
    
    const [otherPizzaList, setOtherPizzaList] = useState(null);
    const [PopulerPizzaList, setPopulerPizzaList] = useState(null);
    const [specialOfferList, setSpecialOfferList] = useState(null);
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
            const [getHomePizzasResponse, sliderData, getDynamicSliderResponse] = await Promise.all([
                getHomePizzas(),
                getDynamicSlider(),
                getDynamicSlidersImage(),
            ]);

            setOtherPizzaList(getHomePizzasResponse?.data?.otherPizzas);
            setSpecialOfferList(getHomePizzasResponse?.data?.specialPizzas);
            setSignaturePizzaList(getHomePizzasResponse?.data?.signaturePizzas);
            setOfferCards(getHomePizzasResponse?.data?.offerCards);
            setGetSlider(sliderData?.data);
            setSliderDataNew(getDynamicSliderResponse?.data?.filter((data) => data?.code !== "static"));

            const rawPopularItems = getHomePizzasResponse?.data?.popularItems || [];
            const filteredPopularPizzas = rawPopularItems
                ?.filter(item => item.productType && (item.productType === "other" || item.productType === "signature" || item.productType === "drinks" || item.productType === "sides" || item.productType === "dips"))
                ?.map(item => ({
                    ...item,
                    pizzaName: item.name,
                    pizzaImage: item.image,
                    pizzaSubtitle: null,
                    ratings: item.ratings,
                    code: item.code
                })) || [];
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
            {/* <Suspense fallback={<LoadingLayout />}>
                <HeroSliderNew sliderData={sliderDataNew} />
            </Suspense> */}
            <div className="container-fluid container-lg px-0">
                <CategoryPizza />
                <OfferCards offers={offerCards} />
                <PizzaCarousel sectionSubTitle={`Craving Something Delicious?`} sectionTitle={`Explore Our Top Deals`} pizzas={specialOfferList} type="special" redirectBase={'/specialoffer'} />
                <PizzaCarousel sectionSubTitle={`Choose your Flavour`} sectionTitle={`Our Delicious Items`} pizzas={signaturePizzaList} type="signature" redirectBase={'/signaturepizza'} />
                <PizzaCarousel sectionSubTitle={`Choose your Flavour`} sectionTitle={`Our Customers Top Picks`} pizzas={otherPizzaList} type="other" redirectBase={'/otherpizza'} />
                <PizzaCarousel sectionSubTitle={`Select your Flavour`} sectionTitle={`Try Our Bestsellers`} pizzas={PopulerPizzaList} type="menu" redirectBase={'/menu'} />
            </div>
            <div className="container-fluid px-0">
                {/* <DownloadSection /> */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;