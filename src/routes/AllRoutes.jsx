// src/routes/AllRoutes.jsx
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "../ScrollToTop.jsx";
import Sidebar from "../layouts/Sidebar";
import MobileMenu from "../components/_main/MobileMenu";
import { useDynamicSEO } from "../hooks/useDynamicSEO.js";
import { useSiteDataContext } from "../context/SiteDataContext.jsx";
import LoadingLayout from "../layouts/LoadingLayout.jsx";

// ── Eagerly loaded — above-the-fold, highest priority ─────────────────────────
import Home from "../pages/Home.jsx";
import Menu from "../pages/Menu.jsx";

// ── Lazily loaded — each page becomes its own JS chunk ────────────────────────
// Auth
const LoginPage          = lazy(() => import("../pages/Auth/LoginPage.jsx"));
const RegistrationPage   = lazy(() => import("../pages/Auth/RegistrationPage.jsx"));
const MyAccount          = lazy(() => import("../pages/Auth/MyAccount.jsx"));
const ForgetPassword     = lazy(() => import("../components/_main/Auth/ForgetPassword.jsx"));
const UpdatePassword     = lazy(() => import("../components/_main/Auth/UpdatePassword.jsx"));
// Info pages
const AboutUs            = lazy(() => import("../pages/About/About.jsx"));
const ContactUs          = lazy(() => import("../pages/ContactUs.jsx"));
const Stores             = lazy(() => import("../pages/Stores.jsx"));
const Franchise          = lazy(() => import("../pages/Franchise/Franchise.jsx"));
const SearchResult       = lazy(() => import("../components/_main/SearchResult.jsx"));
// Legal
const PrivacyPolicy      = lazy(() => import("../pages/PrivacyPolicy.jsx"));
const TermsCondtions     = lazy(() => import("../pages/TermsCondtions.jsx"));
const RefundPolicy       = lazy(() => import("../pages/RefundPolicy.jsx"));
// Pizza
const SignaturePizzaList = lazy(() => import("../pages/SignaturePizza/SignaturePizza.jsx"));
const Signature          = lazy(() => import("../pages/SignaturePizza/Signature.jsx"));
const EditSignature      = lazy(() => import("../pages/SignaturePizza/EditSignaturePizza.jsx"));
const OtherPizzaList     = lazy(() => import("../pages/OtherPizza/OtherPizza.jsx"));
const Other              = lazy(() => import("../pages/OtherPizza/Other.jsx"));
const EditOther          = lazy(() => import("../pages/OtherPizza/EditOtherPizza.jsx"));
const CreatePizza        = lazy(() => import("../pages/Createyourown/Create.jsx"));
const EditCreatePizza    = lazy(() => import("../pages/Createyourown/EditCreatePizza.jsx"));
// Deals
const SpecialOfferList   = lazy(() => import("../pages/SpecialOffer/SpecialOfferList.jsx"));
const SpecialOffer       = lazy(() => import("../pages/SpecialOffer/SpecialOffer.jsx"));
const EditSpecialOffer   = lazy(() => import("../pages/SpecialOffer/EditSpecialOffer.jsx"));
const SpecialOfferWithToppingsList = lazy(() => import("../pages/SpecialOffer/SpecialOfferWithToppingsList.jsx"));
const SpecialOfferPage   = lazy(() => import("../pages/SpecialOfferNew/SpecialOfferPage.jsx"));
const EditSpecialOfferPage = lazy(() => import("../pages/SpecialOfferNew/EditSpecialOfferPage.jsx"));
const FlexDealList       = lazy(() => import("../pages/FlexDeals/FlexDealList.jsx"));
const FlexDealCustomizer = lazy(() => import("../pages/FlexDeals/FlexDealCustomizer.jsx"));
// Side items
const Sides              = lazy(() => import("../pages/Sides/Sides.jsx"));
const Dips               = lazy(() => import("../pages/Dips/Dips.jsx"));
const Drinks             = lazy(() => import("../pages/Drinks/Drinks.jsx"));
const CustomizeDrinks    = lazy(() => import("../components/_main/Drinks/CustomizeDrinks.jsx"));
// Checkout
const Cart               = lazy(() => import("../pages/Cart.jsx"));
const CheckoutPage       = lazy(() => import("../pages/CheckoutPage.jsx"));
const Success            = lazy(() => import("../pages/Payment/Success.jsx"));
const PaymentCancel      = lazy(() => import("../pages/PaymentCancel.jsx"));
const PaymentSuccess     = lazy(() => import("../pages/PaymentSuccess.jsx"));
// Misc
const PopularItem        = lazy(() => import("../pages/PopularItem/PopularItem.jsx"));


const AllRoutes = () => {
    const { siteData } = useSiteDataContext();

    // Call the custom hook here
    useDynamicSEO(siteData);
    return (
        <>
            <ScrollToTop />
            <MobileMenu />
            <Sidebar />
            <Suspense fallback={<LoadingLayout />}>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/menu" element={<Menu />} />
                {/* <Route path="/franchise" element={<Franchise />} /> */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms-conditions" element={<TermsCondtions />} />
                <Route path="/search-results" element={<SearchResult />} />

                <Route path="/:ptype" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />

                {/* My Account */}
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/populerpizza" element={<PopularItem />} />

                {/* Create Your Own */}
                <Route path="/create-your-own/" element={<CreatePizza />} />
                <Route path="/create-your-own/:uid" element={<EditCreatePizza />} />

                {/* Deals */}
                <Route path="/specialoffer" element={<SpecialOfferList />} />
                <Route path="/specialoffer/:sid" element={<SpecialOfferPage />} />
                <Route path="/specialoffer/:pid/:sid" element={<EditSpecialOfferPage />} />

                {/* Deals+toppings — dedicated list page with its own API call */}
                <Route path="/special-offers-with-toppings" element={<SpecialOfferWithToppingsList />} />
                <Route path="/special-offers-with-toppings/:sid" element={<SpecialOffer />} />
                <Route path="/special-offers-with-toppings/:pid/:sid" element={<EditSpecialOffer />} />

                {/* ── Flex Deals (V3 Slot-Based) — completely separate section ── */}
                <Route path="/flex-deals" element={<FlexDealList />} />
                <Route path="/flex-deals/:code" element={<FlexDealCustomizer />} />

                {/* Signature Pizzas */}
                <Route path="/signaturepizza" element={<SignaturePizzaList />} />
                <Route path="/signaturepizza/:sid" element={<Signature />} />
                <Route path="/signaturepizza/:pid/:sid" element={<EditSignature />} />

                {/* Other Pizzas */}
                <Route path="/otherpizza" element={<OtherPizzaList />} />
                <Route path="/otherpizza/:sid" element={<Other />} />
                <Route path="/otherpizza/:pid/:sid" element={<EditOther />} />

                <Route path="/sides" element={<Sides />} />
                <Route path="/dips" element={<Dips />} />
                <Route path="/drinks" element={<Drinks />} />
                <Route path="/customize-drink/:did" element={<CustomizeDrinks />} />

                {/* Cart, Checkout & Payments */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/verify" element={<Success />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/customer/payment/success" element={<Navigate to="/payment/success" replace />} />
                <Route path="/customer/payment/cancel" element={<Navigate to="/payment/cancel" replace />} />
            </Routes>
            </Suspense>
        </>
    );
};

export default AllRoutes;