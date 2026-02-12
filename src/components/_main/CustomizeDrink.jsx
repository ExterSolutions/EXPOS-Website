import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import http from '../../services/http'; // Assuming the same HTTP service

const CustomizeDrink = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                // Assuming there's an API endpoint to fetch product by code, e.g., /products/:code
                // Adjust the endpoint as per your API
                const response = await http.get(`/products/${code}`);
                setProduct(response.data); // Adjust based on your API response structure
            } catch (err) {
                setError(err.message);
                console.error('Error fetching product:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (code) {
            fetchProduct();
        }
    }, [code]);

    if (isLoading) {
        return (
            <div className="customize-drink-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="customize-drink-error">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for couldn't be found.</p>
                <div className="error-actions">
                    <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
                    <Link to="/" className="home-btn">Back to Home</Link>
                </div>
            </div>
        );
    }



return (
    <div className="customize-drink-page">
        <div className="container">
            <div className="product-header">
                <button onClick={() => navigate(-1)} className="back-arrow">&larr;</button>
                <h1>{product.name}</h1>
            </div>
            <div className="product-details-grid">
                {product.image && (
                    <div className="product-image-section">
                        <img
                            src={product.image.replace(/\\/g, '')}
                            alt={product.name}
                            className="product-detail-image"
                        />
                    </div>
                )}
                <div className="product-info-section">
                    <div className="product-meta">
                        <span className="product-ratings">⭐ {product.ratings || 'N/A'}</span>
                        {/* Add price if available */}
                        {product.price && <span className="product-price">${product.price}</span>}
                    </div>
                    <p className="product-description">{product.description || 'Customize your drink/pizza here.'}</p>
                    {/* Customization options - placeholder */}
                    <div className="customization-options">
                        <h3>Customization</h3>
                        <p>Options for toppings, sizes, etc. would go here.</p>
                        {/* Add form for customization */}
                    </div>
                    <div className="product-actions">
                        <button
                            className="add-to-cart-btn-large"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default CustomizeDrink;