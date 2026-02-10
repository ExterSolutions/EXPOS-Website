import { useEffect, useState } from "react";
import pizzaImg from "../../assets/images/customizePizza.jpg";
import "../../assets/styles/new/homepage/about/about.css";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";
import { aboutPage } from "../../services";

const HERO_STYLE = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "140px 40px 120px",
    textAlign: "center",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const TITLE_STYLE = {
    fontSize: "4rem",
    fontWeight: 900,
    color: "white",
    margin: 0,
    textTransform: "uppercase",
    textShadow: "2px 2px 6px rgba(0,0,0,0.15)",
    letterSpacing: "12px",
};

const WRAPPER_STYLE = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
};

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            await aboutPage().then((res) => {
                setAboutData(res.data);
            }).catch((err) => {
                console.error("ERROR From About Page API: ", err);
            }).finally(() => {
                setLoading(false);
            });
        };

        fetchData();

    }, []);

    return (
        <div>
            <Header />

            {/* --- HERO --- */}
            <section
                className="hero-section-about"
                style={{
                    ...HERO_STYLE,
                    backgroundImage: `
                        linear-gradient(135deg, rgba(245,166,35,0.4), rgba(247,183,51,0.35), rgba(255,213,107,0.3)),
                        url(${pizzaImg})
                    `,
                }}
            >
                <h1 style={TITLE_STYLE}>About Us</h1>
            </section>

            {/* --- CONTENT --- */}
            <div className="container-fluid container-lg my-5 px-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-orange-500" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : aboutData?.htmlContent ? (
                    <div
                        className="api-content-wrapper text-center"
                        style={WRAPPER_STYLE}
                        dangerouslySetInnerHTML={{ __html: aboutData.htmlContent }}
                    />
                ) : (
                    <div className="text-center py-5">
                        <p className="text-gray-600">
                            Unable to load content. Please try again later.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default About;
