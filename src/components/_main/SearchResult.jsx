import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import http from '../../services/http'; 
// import '../../assets/styles/new/header/searchResult.css';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const { results = [] } = location.state || {}; 
    const [menuData, setMenuData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setIsLoading(true);
               
                const response = await http.get('/menu'); 
                setMenuData(response.data.data || response.data || []);
            } catch (err) {
                console.error('Error fetching menu data:', err);
                // Optionally set error state
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    const handleViewDetails = (product) => {
        // Find the full product details from menu data using code or id
        const fullProduct = menuData?.find(item => item.code === product.code || item.id === product.id);
        if (fullProduct?.slug) {
            navigate(`/menu/${fullProduct.slug}`);
        } else {
            navigate('/menu', { state: { selectedProduct: product, highlightExact: true } });
        }
    };

    if (isLoading) {
        return (
            <div className="search-results-page">
                <div className="container">
                    <h1>Search Results for "{decodeURIComponent(query)}"</h1>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If no results from state, fallback to empty (or fetch based on query if needed)
    if (!results || results.length === 0) {
        return (
            <div className="search-results-page">
                <div className="container">
                    <h1>Search Results for "{decodeURIComponent(query)}"</h1>
                    <div className="no-results">
                        <p>No products found for "{decodeURIComponent(query)}". Try a different search term.</p>
                        <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    // Merge search results with menu data for richer display (e.g., add slugs, prices)
    const enrichedResults = results.map(result => {
        const menuItem = menuData?.find(item => item.code === result.code || item.id === result.id);
        return { ...result, ...menuItem }; // Merge to get slug, etc.
    }).filter(Boolean); // Filter out any null/undefined after merge

    return (
        <div className="search-results-page">
            <div className="container">
                <h1>Search Results for "{decodeURIComponent(query)}"</h1>
                {enrichedResults.length > 0 ? (
                    <div className="results-grid">
                        {enrichedResults.map((product) => (
                            <div key={product.code || product.id} className="product-card">
                                {product.image && (
                                    <img
                                        src={product.image.replace(/\\/g, '')}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} // Fallback image
                                    />
                                )}
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <span className="product-ratings">⭐ {product.ratings || 'N/A'}</span>
                                    {/* Display additional menu data if available, e.g., price */}
                                    {product.price && <span className="product-price">${product.price}</span>}
                                    <div className="product-actions">
                                        <button
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(product)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No products found for "{decodeURIComponent(query)}". Try a different search term.</p>
                        <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResult;