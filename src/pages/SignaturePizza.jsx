import { useEffect, useState } from "react";
// import "../assets/styles/menu-cards/signatures.css";
import '../cardsui/cardsui.css';
import SignaturePizzas from "../components/_main/SignaturePizza/signturePizza";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getSignaturePizza, getAllIngredients } from "../services";

function SignaturePizza({ toppingsData }) {
    const [signatureData, setSignatureData] = useState();
    const [ingredients, setIngredients] = useState();
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();
    const signaturepizza = async () => {
        setLoading(true)
        try {
            const [res, ingRes] = await Promise.all([
                getSignaturePizza(),
                getAllIngredients()
            ]);
            setSignatureData(res.data);
            setIngredients(ingRes.data);
        } catch (err) {
            console.error("Error fetching signature pizzas or ingredients:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        signaturepizza();
    }, []);

    return (
        <>
            {loading ? (<LoadingLayout />) : (
                <div className="section" id="signaturemenucard">
                    <div className="container-fluid container-lg mb-5">
                        <div className="row g-3">
                            {signatureData?.map((data) => {
                                return (
                                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3" key={"special-grid-card-" + data?.code}>
                                        <SignaturePizzas data={data} key={data.sideCode} toppingsData={toppingsData} ingredients={ingredients} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div >)
            }
        </>
    );
}

export default SignaturePizza;
