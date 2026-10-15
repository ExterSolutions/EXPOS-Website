import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import '../assets/styles/modern-cards.css';
import OtherPizzas from "../components/_main/OtherPizza/otherPizza";
import { GlobalContext } from "../context/GlobalContext";
import DataNotFound from "../layouts/DataNotFound";
import LoadingLayout from "../layouts/LoadingLayout";
import { getAllIngredients, getOtherPizza } from "../services";

function OtherPizza({ toppingsData }) {
    const globalCtx = useContext(GlobalContext);
    const currentStoreCode = globalCtx.currentStoreCode[0];

    const [ingredients, setIngredients] = useState([]);
    const [otherData, setOtherData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [getAllIngredientsData, getOtherPizzaData] = await Promise.all([
                getAllIngredients(),
                getOtherPizza(currentStoreCode)
            ]);
            setIngredients(getAllIngredientsData.data || []);
            setOtherData(getOtherPizzaData.data || []);
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 500) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentStoreCode]);

    if (loading) return <LoadingLayout />;
    if (otherData?.length === 0) return <DataNotFound />;

    return (
        <div className="section" id="othermenucard">
            <div className="container-fluid container-lg mb-5">
                <div className="mc-grid">
                    {otherData?.map((data) => (
                        <OtherPizzas
                            data={data}
                            key={"special-grid-card-" + data?.code}
                            toppingsData={toppingsData}
                            ingredients={ingredients}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OtherPizza;
