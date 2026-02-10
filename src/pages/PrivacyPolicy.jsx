

import { useEffect, useState } from 'react';
import '../assets/styles/privacypolicy.css';
import Footer from '../components/_main/Footer';
import Header from '../components/_main/Header/Header';
import { privacyPage } from '../services';
import { toast } from 'react-toastify';

function PrivacyPolicy() {
    const [privacyData, setPrivacyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            await privacyPage().then((res) => {
                setPrivacyData(res.data);
            }).catch((err) => {
                toast.error("ERROR From Privacy policy Page API: ", err);
            }).finally(() => {
                setLoading(false);
            });
        };

        fetchData();

    }, []);

    return (
        <>
            <Header />
            <div className='container my-5'>
                <div className="mb-4 text-center">
                    <h1 className="fs-2 fw-bold">Privacy Policy</h1>
                </div>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : privacyData ? (
                    <div
                        className="privacy-content"
                        dangerouslySetInnerHTML={{ __html: privacyData.htmlContent }}
                    />
                ) : (
                    <div className="text-center py-5">
                        <p>Unable to load content. Please try again later.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PrivacyPolicy;