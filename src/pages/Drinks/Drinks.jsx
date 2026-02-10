import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
// import Tabs from "../../components/Tabs/Tabs";
import DrinkMenu from "../DrinkMenu";

const Drinks = () => {
  return (
    <>
      <div style={{ position: "relative" }}>
        <Header />
        <div className="nav-margin"></div>
        <div className="d-flex align-items-center justify-content-between innder-page-header">
          <div className="flex-grow-1 section-header">
            <span className="category-subtitle">CHOOSE YOUR FLAVOR</span>
            <div className="section-title">Drinks</div>
          </div>
        </div>
        <DrinkMenu />
        <Footer />
      </div>
    </>
  );
};

export default Drinks;
