import { useEffect, useState } from "react";
import '../assets/styles/modern-cards.css';
import SignaturePizzas from "../components/_main/SignaturePizza/signturePizza";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getSignaturePizza } from "../services";

function SignaturePizza({ toppingsData }) {
    const [signatureData, setSignatureData] = useState();
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();

    const signaturepizza = async () => {
        setLoading(true);
        await getSignaturePizza()
            .then((res) => {
                setSignatureData(res.data);
            })
            .catch((err) => {
                console.error("Error From Get Sides :", err);
            }).finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        signaturepizza();
    }, []);

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <div className="section" id="signaturemenucard">
                    <div className="container-fluid container-lg mb-5">
                        <div className="mc-grid">
                            {signatureData?.map((data) => (
                                <SignaturePizzas
                                    data={data}
                                    key={"special-grid-card-" + data?.code}
                                    toppingsData={toppingsData}
                                    cartFn={cartFn}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SignaturePizza;
