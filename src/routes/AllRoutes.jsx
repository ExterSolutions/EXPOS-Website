// src/routes/AllRoutes.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import ForgetPassword from "../components/_main/Auth/ForgetPassword.jsx";
import UpdatePassword from "../components/_main/Auth/UpdatePassword.jsx";
import CustomizeDrinks from "../components/_main/Drinks/CustomizeDrinks.jsx";
import SearchResult from "../components/_main/SearchResult.jsx";
import AboutUs from "../pages/About/About.jsx";
import LoginPage from "../pages/Auth/LoginPage.jsx";
import MyAccount from "../pages/Auth/MyAccount.jsx";
import RegistrationPage from "../pages/Auth/RegistrationPage.jsx";
import Cart from "../pages/Cart.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import ContactUs from "../pages/ContactUs.jsx";
import CreatePizza from "../pages/Createyourown/Create.jsx";
import EditCreatePizza from "../pages/Createyourown/EditCreatePizza.jsx";
import Dips from "../pages/Dips/Dips.jsx";
import Drinks from "../pages/Drinks/Drinks.jsx";
import Franchise from "../pages/Franchise/Franchise.jsx";
import Home from "../pages/Home.jsx";
import Menu from "../pages/Menu.jsx";
import EditOther from "../pages/OtherPizza/EditOtherPizza.jsx";
import Other from "../pages/OtherPizza/Other.jsx";
import OtherPizzaList from "../pages/OtherPizza/OtherPizza.jsx";
import Success from "../pages/Payment/Success.jsx";
import PaymentCancel from "../pages/PaymentCancel.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import PopularItem from "../pages/PopularItem/PopularItem.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import RefundPolicy from "../pages/RefundPolicy.jsx";
import Sides from "../pages/Sides/Sides.jsx";
import EditSignature from "../pages/SignaturePizza/EditSignaturePizza.jsx";
import Signature from "../pages/SignaturePizza/Signature.jsx";
import SignaturePizzaList from "../pages/SignaturePizza/SignaturePizza.jsx";
import EditSpecialOffer from "../pages/SpecialOffer/EditSpecialOffer.jsx";
import SpecialOffer from "../pages/SpecialOffer/SpecialOffer.jsx";
import SpecialOfferList from "../pages/SpecialOffer/SpecialOfferList.jsx";
import TermsCondtions from "../pages/TermsCondtions.jsx";
import SpecialOfferPage from "../pages/SpecialOfferNew/SpecialOfferPage.jsx";
import EditSpecialOfferPage from "../pages/SpecialOfferNew/EditSpecialOfferPage.jsx";
import SpecialOfferWithToppingsList from "../pages/SpecialOffer/SpecialOfferWithToppingsList.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import Sidebar from "../layouts/Sidebar";
import MobileMenu from "../components/_main/MobileMenu";
import { useDynamicSEO } from "../hooks/useDynamicSEO.js";
import { useSiteDataContext } from "../context/SiteDataContext.jsx";

const AllRoutes = () => {
    const { siteData } = useSiteDataContext();

    // Call the custom hook here
    useDynamicSEO(siteData);
    return (
        <>
            <ScrollToTop />
            <MobileMenu />
            <Sidebar />
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
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
                <Route path="/addtocart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/verify" element={<Success />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/customer/payment/success" element={<Navigate to="/payment/success" replace />} />
                <Route path="/customer/payment/cancel" element={<Navigate to="/payment/cancel" replace />} />
            </Routes>
        </>
    );
};

export default AllRoutes;