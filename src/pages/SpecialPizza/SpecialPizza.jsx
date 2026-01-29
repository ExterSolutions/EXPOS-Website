import { Link } from "react-router-dom";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import Tabs from "../../components/Tabs/Tabs";
import SpecialMenuList from "../../components/_main/SpecialMenuList";

const SpecialPizzaList = () => {
    return (
        <>
            <div style={{ position: "relative" }}>
                <Header />
                <Tabs />
                <SpecialMenuList />
                <Footer />
            </div>
        </>
    )
}

export default SpecialPizzaList;