import React from 'react';
import { Link } from 'react-router-dom';

const SearchDropdown = ({ results, onClose }) => {
    if (!results || results.length === 0) {
        return (
            <div className="search-dropdown">
                <div className="dropdown-item">No results found</div>
            </div>
        );
    }

    // Helper to get dynamic redirect path based on productType
    const getRedirectPath = (item) => {
        const type = item?.productType || '';
        let basePath;
        switch (type.toLowerCase()) {
            case 'signature':
                basePath = `/signaturepizza/${item?.code}`;
                break;
            case 'other':
                basePath = `/otherpizza/${item?.code}`;
                break;
            case 'dips':
                basePath = '/dips';
                break;
            case 'drinks':
                basePath = '/drinks';
                break;
            case 'sides':
                basePath = '/sides';
                break;
            default:
                basePath = '/menu';
        }
        return `${basePath}`;
    };

    return (
        <div className="search-dropdown">
            {results.map((item, index) => (
                <Link
                    key={`${item.code}-${index}`}
                    to={getRedirectPath(item)}
                    className="dropdown-item d-flex align-items-center"
                    onClick={onClose}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="search-result-image me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                        <div className="fw-bold">{item.name}</div>
                        <small className="text-muted">{item.productType}</small>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchDropdown;