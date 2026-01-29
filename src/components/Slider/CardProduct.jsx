import { Link } from "react-router-dom";

const CardProudct = ({ pizza_name, pizza_subtitle }) => {
    return (
        <div className="card">
            <div
                className="image-content">
                <div
                    className="product-image"
                    style={{
                        backgroundImage: `url(https://www.engelvoelkers.com/wp-content/uploads/2014/07/pizza-stock.jpg)`,
                        backgroundSize: 'cover',   // Cover the entire div
                        backgroundPosition: 'center', // Center the image 
                        width: '100%',             // Set a width for the div
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                </div>
            </div>
            <div className="card-content my-3">
                <div className="card-title">{pizza_name}</div>
                <div className="pricing-tag">{pizza_subtitle}</div>
            </div>
            <div className="card-content">
                <Link to={"/create-your-own"} className="btn1 stl2 text-decoration-none fs-6">
                    {'CREATE'}
                </Link>
            </div >
        </div >
    );
};

export default CardProudct;