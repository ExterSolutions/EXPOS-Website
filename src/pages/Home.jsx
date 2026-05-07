// src/pages/Home.jsx - UPDATED VERSION
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import { useLocation, Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import CartFunction from "../components/cart";
import { getDynamicSlider, getDynamicSlidersImage, getHomePizzas, settingApi, getFlexDeals } from "../services";
import { toast } from "react-toastify";
import PizzaCarousel from "../components/_main/Carousel/PizzaCarousel";
import LoadingLayout from "../layouts/LoadingLayout";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryPizza from "./Categories/CategoryPizza";
import "./home-mobile.css";


// ── Flex Deals promo section on Home page ─────────────────────────────────────
const FlexDealsHomeSection = () => {
    const [count, setCount] = React.useState(null);
    const globalctx = React.useContext(GlobalContext);
    const [currentCity] = globalctx?.currentCity ?? [null];

    React.useEffect(() => {
        const cityCode = currentCity?.cityCode ?? currentCity?.code ?? null;
        getFlexDeals(cityCode)
            .then(res => {
                if (res?.status === 200 && Array.isArray(res.data)) setCount(res.data.length);
                else setCount(0);
            })
            .catch(() => setCount(0));
    }, [currentCity]);

    // Don't render if no deals available
    if (count === 0) return null;

    return (
        <div style={{ padding: '0 0 0.5rem', margin: '0.25rem 1rem 0.5rem' }}>
            <Link to="/flex-deals" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
                    borderRadius: '1rem',
                    padding: '1.1rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    boxShadow: '0 4px 20px rgba(255,107,53,0.15)',
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                            color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                            letterSpacing: '0.1em', padding: '0.2rem 0.65rem',
                            borderRadius: '2rem', marginBottom: '0.4rem',
                        }}>
                            🔥 NEW
                        </div>
                        <h4 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.25 }}>
                            Flex Deals
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,0.65)', margin: '0.2rem 0 0', fontSize: '0.78rem' }}>
                            {count != null ? `${count} customizable deal${count !== 1 ? 's' : ''} available` : 'Mix & match your favourites'}
                        </p>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        color: '#fff', border: 'none', borderRadius: '0.65rem',
                        padding: '0.6rem 1.1rem', fontSize: '0.85rem', fontWeight: 700,
                        whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                        See Deals →
                    </div>
                </div>
            </Link>
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────────────────

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
    const [topDealsList, setTopDealsList] = useState([]);        // flex deals only (V3 API)
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
            const currentCity = globalctx?.currentCity?.[0] ?? null;
            const cityCode = currentCity?.cityCode ?? currentCity?.code ?? null;

            const [getHomePizzasResponse, sliderData, getDynamicSliderResponse, flexDealsResponse] = await Promise.all([
                getHomePizzas(),
                getDynamicSlider(),
                getDynamicSlidersImage(),
                getFlexDeals(cityCode),
            ]);

            setOtherPizzaList(getHomePizzasResponse?.data?.otherPizzas);
            setSignaturePizzaList(getHomePizzasResponse?.data?.signaturePizzas);
            setOfferCards(getHomePizzasResponse?.data?.offerCards);
            setGetSlider(sliderData?.data);
            setSliderDataNew(getDynamicSliderResponse?.data?.filter((data) => data?.code !== "static"));

            // ── Top Deals = Flex Deals ONLY (V3 API) ───────────────────
            // All deals come from the admin's "Flex Deals" section.
            // Clicking a tile opens the Flex Deal customiser (/flex-deals/:code).
            const rawFlexDeals = Array.isArray(flexDealsResponse?.data)
                ? flexDealsResponse.data
                : Array.isArray(flexDealsResponse)
                    ? flexDealsResponse
                    : [];

            const flexDeals = rawFlexDeals.map(deal => {
                const validPrices = (deal.pizza_prices ?? []).filter(p => Number(p.price) > 0);
                const minPrice = validPrices.length > 0
                    ? Math.min(...validPrices.map(p => Number(p.price)))
                    : Number(deal.price ?? 0);
                return {
                    code:         deal.code,
                    pizzaName:    deal.name,
                    pizzaImage:   deal.image,
                    description:  deal.description || deal.subtitle || '',
                    displayPrice: minPrice > 0 ? minPrice : null,
                    productType:  'flex',   // routes to /flex-deals/:code
                };
            });

            setTopDealsList(flexDeals);

            // ── Popular / Best Sellers ──────────────────────────────────
            const rawPopularItems = getHomePizzasResponse?.data?.popularItems || [];

            const signatureItems = rawPopularItems
                .filter(item => item.productType === "signature")
                .map(item => ({
                    ...item,
                    pizzaName:    item.name,
                    pizzaImage:   item.image,
                    pizzaSubtitle: null,
                    displayPrice: item?.pizza_prices?.[0]?.price ?? null,
                }));

            const sideItems = rawPopularItems
                .filter(item => item.productType === "sides")
                .slice(0, 3)
                .map(item => ({
                    ...item,
                    pizzaName:    item.sideName || item.name,
                    pizzaImage:   item.image,
                    pizzaSubtitle: null,
                    displayPrice: item?.combination?.[0]?.price ?? null,
                }));

            setPopulerPizzaList([...signatureItems, ...sideItems]);
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
                {/* Top Deals — Flex Deals only (V3 API). Horizontal list cards, tiles link to /flex-deals/:code */}
                <PizzaCarousel sectionSubTitle={`🔥 Craving Something Delicious?`} sectionTitle={`Top Deals`} pizzas={topDealsList} type="flex" redirectBase={'/flex-deals'} viewAllLink="/flex-deals" layout="horizontal" />
                <PizzaCarousel sectionSubTitle={`Choose your Flavour`} sectionTitle={`Signature Pizzas`} pizzas={signaturePizzaList} type="signature" redirectBase={'/signaturepizza'} viewAllLink="/signaturepizza" layout="horizontal" />
                <PizzaCarousel sectionSubTitle={`Our Customers Love These`} sectionTitle={`Best Sellers`} pizzas={PopulerPizzaList} type="menu" redirectBase={'/menu'} showBestSelling={true} viewAllLink="/menu" layout="horizontal" />
            </div>
            <div className="container-fluid px-0">
                {/* <DownloadSection /> */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;