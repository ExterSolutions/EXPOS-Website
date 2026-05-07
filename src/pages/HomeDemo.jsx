import React, { useContext, useEffect, useRef, useState, Suspense, lazy } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import { useLocation } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import CartFunction from "../components/cart";
import { getDynamicSlider, getDynamicSlidersImage, getHomePizzas, settingApi } from "../services";
import { toast } from "react-toastify";
// import LocationAccess from "../components/_main/LocationAccess";
import PizzaCarousel from "../components/_main/Carousel/PizzaCarousel";
import DownloadApps from "../components/_main/DownloadApps";
// import HeroSliderNew from "../components/_main/Carousel/HeroSliderNew";
// import "../assets/styles/theme/theme.css";
// import '../assets/styles/card.css';
import LoadingLayout from "../layouts/LoadingLayout";
import AOS from "aos";
import "aos/dist/aos.css";
import TopBanner from "../components/_main/TopBanner";

const HeroSliderNew = lazy(() => import('../components/_main/Carousel/HeroSliderNew'));


const HomeDemo = () => {
    const [loading, setLoading] = useState(true);
    // Global Context
    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [url, setUrl] = globalctx.urlPath;
    const [settings, setSettings] = globalctx.settings;
    const [selectedType, setSelectedType] = globalctx.selectedType;
    const [scrollToSignature, setScrollToSignature] = globalctx.scrollToSignature;
    const [otherPizzaList, setOtherPizzaList] = useState(null);
    const [specialOfferList, setSpecialOfferList] = useState(null);
    const [signaturePizzaList, setSignaturePizzaList] = useState(null);
    const [getSlider, setGetSlider] = useState([]);
    const [sliderDataNew, setSliderDataNew] = useState([]);
    const signaturePizzaRef = useRef(null);

    const location = useLocation();
    // Helper Function
    const cartFn = new CartFunction();

    useEffect(() => {
        cartFn.createCart(setCart);
    }, [setCart]);

    useEffect(() => {
        setUrl(location?.pathname);
    }, [location]);

    useEffect(() => {
        if (!selectedType) {
            setSelectedType('delivery');
            localStorage.setItem('selectedType', 'delivery');
        }
    }, [selectedType])

    useEffect(() => {
        if (scrollToSignature) {
            const element = signaturePizzaRef.current;
            if (element) {
                const stickyNavbarHeight = 70; // Adjust this value to match your sticky navbar's height
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - stickyNavbarHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        }
    }, [scrollToSignature]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Make all API calls concurrently
            const [getHomePizzasResponse, sliderData, getDynamicSliderResponse] = await Promise.all([
                getHomePizzas(),
                getDynamicSlider(), // Add getDynamicSlider() here
                getDynamicSlidersImage(),
            ]);
            // Update state only if the requests succeed
            setOtherPizzaList(getHomePizzasResponse?.data?.otherPizzas);
            setSpecialOfferList(getHomePizzasResponse?.data?.specialPizzas);
            setSignaturePizzaList(getHomePizzasResponse?.data?.signaturePizzas);
            setGetSlider(sliderData?.data); // Assuming sliderData is from getDynamicSlider
            setSliderDataNew(getDynamicSliderResponse?.data?.filter((data) => data?.code !== "static"))
            // Set loading to false after all data is fetched
            setLoading(false);
        } catch (error) {
            // If there is an error, log it and set loading to false
            setLoading(false);
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message || 'An error occurred while fetching data.');
            } else {
                // toast.error('An unexpected error occurred.');
            }
        }
    };


    useEffect(() => {
        // Fetch settings data
        settingApi()
            .then((res) => {
                setSettings(res.data);
            })
            .catch((err) => {
                if (err.response?.status === 400 || err.response?.status === 500) {
                    toast.error(err.response.data.message);
                }
            });

        // Fetch other data (other pizza, offers, etc.)
        fetchData();
    }, []);
    useEffect(() => {
        if (!loading) {
            AOS.init({ duration: 1000 });
        }
    });


    if (loading) return <LoadingLayout />;



    return (
        <div >
            <TopBanner />
            <Header isdemo={true} />
            <div className="nav-margin"></div>
            <Suspense fallback={<LoadingLayout />}>
                <HeroSliderNew sliderData={sliderDataNew} isdemo={true} />
            </Suspense>
            {/* <HeroSliderNew sliderData={sliderDataNew} /> */}
            {/* <LocationAccess signaturePizzaRef={signaturePizzaRef} isdemo={true} /> */}
            <div ref={signaturePizzaRef} className="m-0 p-0">
                <PizzaCarousel sectionTitle={`Signature Pizza`} pizzas={signaturePizzaList} redirectBase={'/signaturepizza'} isdemo={true} />
            </div>
            <PizzaCarousel sectionTitle={`Deals`} pizzas={specialOfferList} redirectBase={'/specialoffer'} isdemo={true} />
            <PizzaCarousel sectionTitle={`Create Your Own`} pizzas={otherPizzaList} redirectBase={'/otherpizza'} isdemo={true} />
            <DownloadApps isdemo={true} />
FOOTER_PLACEHOLDERisdemo={true} />
        </div>
    );
};

export default HomeDemo;
