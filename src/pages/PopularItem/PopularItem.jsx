
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import PopulerPizza from "./PopulerPizza";  
import { useEffect, useState } from "react";
import { getToppings } from "../../services";
// import "../../assets/styles/new/homepage/pizza/specialoffer.css";


const PopularItem = () => {
  const [toppingsData, setToppingsData] = useState(null);
  const toppings = async () => {
    try {
      const res = await getToppings();
      setToppingsData(res?.data);
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    toppings();
  }, []);
  return (
    <>
      <div style={{ position: "relative" }}>
        <Header />
        <div className="nav-margin"></div>
        <div className="d-flex align-items-center justify-content-between innder-page-header">
          <div className="flex-grow-1 section-header">
            <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
            <div className="section-title">Choose Our Populer Item</div>
          </div>
        </div>
        {/* Renders the popular items grid */}
        <PopulerPizza toppingsData={toppingsData} />

      </div>
    </>
  );
};

export default PopularItem;