import { useEffect, useState } from "react";
// import "../assets/styles/termcondtion.css";
import Footer from "../components/_main/Footer";
import Header from "../components/_main/Header/Header";
import { termsPage } from "../services";
import PageSEO from "../components/_main/PageSEO";

function TermsCondtions() {
    const [termsData, setTermsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            await termsPage().then((res) => {
                setTermsData(res.data);
            }).catch((err) => {
                console.error("ERROR From About Page API: ", err);
            }).finally(() => {
                setLoading(false);
            });
        };

        fetchData();

    }, []);

    return (
        <>
            <PageSEO pageKey="termsConditions" />
            <Header />
            <div className="container my-5">
                <div className="mb-4 text-center">
                    <h1 className="fs-2 fw-bold">Terms and Conditions</h1>
                </div>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : termsData ? (
                    <div
                        className="terms-content"
                        dangerouslySetInnerHTML={{ __html: termsData.htmlContent }}
                    />
                ) : (
                    <div className="text-center py-5">
                        <p>Unable to load content. Please try again later.</p>
                    </div>
                )}
            </div>

        </>
    );
}

export default TermsCondtions;
