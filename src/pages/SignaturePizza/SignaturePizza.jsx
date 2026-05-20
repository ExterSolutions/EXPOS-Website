import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import PageSEO from "../../components/_main/PageSEO";
import Tabs from "../../components/Tabs/Tabs";
import { useEffect, useState } from "react";
import { getToppings } from "../../services";
import SignaturePizza from "../SignaturePizza";
import { GlobalContext } from "../../context/GlobalContext";
import { useContext } from "react";
import { settingApi } from "../../services";;

const SignaturePizzaList = () => {
  const [toppingsData, setToppingsData] = useState(null);
  const [settingsData, setSettingsData] = useState([]);
  const { settings } = useContext(GlobalContext);

  const signaturePizzaTitle =
    settingsData.find((item) => item.shortCode === "signaturepizza")?.settingValue ??
    "Signature Pizza";

  const fetchData = async () => {
    try {
      const [toppingsRes, settingRes] = await Promise.all([
        getToppings(),
        settingApi()
      ]);
      setToppingsData(toppingsRes?.data);
      setSettingsData(settingRes?.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <PageSEO pageKey="signaturePizza" />
      <div style={{ position: "relative" }}>
        <Header />
        <div className="nav-margin"></div>
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between innder-page-header">
            <div className="flex-grow-1 section-header">
              <span className="category-subtitle">{signaturePizzaTitle}</span>
              <div className="section-title">Choose Our Delicious Item</div>
            </div>
          </div>
          <SignaturePizza toppingsData={toppingsData} />
        </div>

      </div>
    </>
  );
};

export default SignaturePizzaList;
