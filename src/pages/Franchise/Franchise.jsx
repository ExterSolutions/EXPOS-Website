import { useFranchiseData } from "./hooks/useFranchiseData";
import { useFranchiseForm } from "./hooks/useFranchiseForm";
import { useTestimonialSlider } from "./hooks/useTestimonialSlider";
import "../../assets/styles/Franchise.css";
import Footer from "../../components/_main/Footer";
import Header from "../../components/_main/Header/Header";

import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import BenefitsSection from "./components/BenefitsSection";
import TestimonialSection from "./components/TestimonialSection";
import FormSection from "./components/FormSection";

const FranchiseHero = () => {
    // Use custom hooks
    const { backgroundImage, statsSectionData, statsMainTitle, statsSubTitle } = useFranchiseData();
    const { formData, errors, loading, handleChange, handleSubmit } = useFranchiseForm();
    
    const testimonials = [
        {
            text: "I loved trying sample of naan pizza creation the other day. MZ Fuel is tandoori chicken bowl with rice with extra protein : paneer butter chicken.",
            author: "Jutta",
            rating: 5
        },
        {
            text: "Amazing food quality and great service! The franchise opportunity is incredible and the support team is always there to help. ",
            author: "Rajesh Kumar",
            rating: 5
        },
        {
            text: "The training program was comprehensive and the ROI has been fantastic. Couldn't be happier with my decision to join this franchise family.",
            author: "Sarah Mitchell",
            rating: 5
        }
    ];

    const { currentSlide, nextSlide, prevSlide, goToSlide } = useTestimonialSlider(testimonials);

    return (
        <>
            <Header />
            <div className="franchise-hero-page">
                <HeroSection backgroundImage={backgroundImage} />
                
                <StatsSection 
                    statsSectionData={statsSectionData}
                    statsMainTitle={statsMainTitle}
                    statsSubTitle={statsSubTitle}
                />
                
                <BenefitsSection />
                
                <TestimonialSection 
                    testimonials={testimonials}
                    currentSlide={currentSlide}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                    goToSlide={goToSlide}
                />
                
                <FormSection 
                    formData={formData}
                    errors={errors}
                    loading={loading}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </div>
            <Footer />
        </>
    );
};

export default FranchiseHero;