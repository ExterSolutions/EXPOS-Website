import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/aboutus.css';

const AboutUs = () => {
    return (
        <div className="container">
            <div id="czcustomcmsblock2" className="czcustomcmsblock_container pt-70 pb-70">
                <div className="czcustomcms">
                    <div className="one-half custombanner-part1">
                        <div className="custombanner-content">
                            <Link className="banner-anchor" to="#">
                                <img className="banner-image1" alt="cms-banner1" src="https://demos.codezeel.com/prestashop/PRS22/PRS220529/default/img/cms/cms-banner-1.jpg" width="300" height="400" />
                            </Link>
                            <Link className="banner-anchor" to="#">
                                <img className="banner-image2" alt="cms-banner2" src="https://demos.codezeel.com/prestashop/PRS22/PRS220529/default/img/cms/cms-banner-2.jpg" width="400" height="520" />
                            </Link>
                        </div>
                    </div>
                    <div className="one-half custombanner-part2">
                        <div className="custombanner-content">
                            <div className="sub-title">About Us</div>
                            <div className="main-title">Chandigarh Pizza</div>
                            <div className="cms-desc">At Chandigarh Pizza, we craft unforgettable vegetarian pizzas that fuse the rich flavors of Punjab with classic Italian style, creating a deliciously sustainable dining experience for food lovers everywhere..
                            </div>
                            <div className="cms-desc">
                                Chandigarh Pizza brings authentic Punjabi-style vegetarian pizzas to Calgary NE. Whether you're searching for "pizza near me" or craving our signature Amritsari Pizza, we’ve got you covered. Visit us at 5 Coral Springs Blvd NE or order online for pickup or delivery!
                            </div>
                        </div>
                        <div className="shopnow">
                            <Link className="btn btn-primary" to="/about-us">Read More</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;