import React, { useEffect } from "react";
import bgImage from "../../assets/images/pizzaimage.jpg";

function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <section className="container-fluid new-block m-0 p-0 w-100">
                <section className="about-us-block new-block">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-custom1 pd0">
                                <div className="img-holder">

                                    <img src={bgImage} alt="" className="img-responsive" style={{ height: '100%' }} />
                                </div>
                            </div>
                            <div className="col-custom2 pd0 card-background-color">
                                <div className="fixed-bg">
                                    <img src={bgImage} alt="" className="img-responsive" />
                                </div>
                                <div className="block-stl12 ">
                                    <p className="my-4 fs-4 card-text-color">
                                        <strong>About Us</strong>
                                    </p>
                                    <p className="fst-italic lh-base infoText card-text-color">

                                        At Exter Pizza, we’re passionate about crafting delicious, 100% vegetarian pizzas that bring together bold, flavorful ingredients to create a truly satisfying experience. Every pizza is made with care, blending tradition with creativity to please every palate.
                                    </p>
                                    <br />
                                    <br />
                                    <p className="fst-italic lh-base infoText card-text-color">
                                       From timeless classics to signature creations, we’re dedicated to delivering exceptional quality, taste, and service. What started as a small local kitchen has grown into a favorite destination for pizza lovers who crave something unique, wholesome, and made with love.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </section>

                <section className="our-history new-block">
                    <div
                        className="fixed-bg parallax"
                        style={{ background: `url(${bgImage})` }}
                    ></div>
                    <div className="overlay "></div>
                    <div className="container-fluid pd0">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title">
                                    <p className="top-h">Satisfaction with every bite</p>
                                    <h2>Our Commitments</h2>
                                    <div className="btm-style">
                                        <span></span>
                                    </div>
                                    <div className="container p-2">
                                        <div className="row gx-3 pt-4 justify-content-center">
                                            <div class="col-lg-10 col-md-12 col-sm-12 col-xs-6">
                                                <div class="block-stl14">
                                                    <div class="img-holder p-1 fst-italic">
                                                        <p className="commitText lh-base">
                                                            <strong className="top-h">Quality - </strong>
                                                            <span className="card-text-color  ">
                                                                Quality is at the heart of everything we do at
                                                                Exter Pizza. We source the fresh produce,
                                                                sauces, and finest cheeses to ensure that every
                                                                pizza we serve is of the highest quality.
                                                            </span>
                                                        </p>
                                                    </div>
                                                    {/* <h5 className="text-white">Quality</h5> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row gx-3  justify-content-center">
                                            <div class="col-lg-10 col-md-12 col-sm-12 col-xs-6">
                                                <div class="block-stl14">
                                                    <div class="img-holder p-1 fst-italic">
                                                        <p className="commitText lh-base">
                                                            <strong className="top-h">Fresh - </strong>
                                                            <span className="card-text-color">
                                                                Our dough is made fresh daily, and our sauces
                                                                are prepared in-house to guarantee that every
                                                                bite is bursting with flavor.
                                                            </span>
                                                        </p>
                                                    </div>
                                                    {/* <h5 className="text-white">Fresh</h5> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row gx-3  justify-content-center">
                                            <div class="col-lg-10 col-md-12 col-sm-12 col-xs-6">
                                                <div class="block-stl14">
                                                    <div class="img-holder p-1 fst-italic">
                                                        <p className="commitText lh-base">
                                                            <strong className="top-h">
                                                                100% Vegetarian -{" "}
                                                            </strong>
                                                            <span className="card-text-color">
                                                                We believe that eating vegetarian shouldn't mean
                                                                sacrificing flavor or satisfaction. From 50+
                                                                fresh vegetable toppings to our rich and creamy
                                                                plant-based cheese, every pizza is a
                                                                celebration of the vibrant flavors. Whether
                                                                you're a lifelong vegetarian or just looking to
                                                                add more plant-based options to your diet, we've
                                                                got something for everyone to enjoy.
                                                            </span>
                                                        </p>
                                                    </div>
                                                    {/* <h5 className="text-white">100% Vegetarian </h5> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default About;
