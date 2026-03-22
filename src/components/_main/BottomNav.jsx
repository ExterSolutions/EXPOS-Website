// src/components/_main/BottomNav.jsx
// Mobile bottom navigation bar - shown only on small screens
import { useContext } from 'react';
import { FaHome, FaPizzaSlice, FaUser } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const globalCtx = useContext(GlobalContext);

    const [cart] = globalCtx?.cart || [{ product: [] }];
    const [isAuthenticated] = globalCtx?.auth || [false];
    const [, setCartSidebar] = globalCtx?.sidebar || [false, () => {}];

    const cartCount = cart?.product?.length || 0;
    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            label: 'Home',
            icon: <FaHome size={20} />,
            action: () => { window.location.href = 'https://web.exter.ca/'; },
            active: location.pathname === '/',
        },
        {
            label: 'Menu',
            icon: <FaPizzaSlice size={20} />,
            action: () => navigate('/menu'),
            active: ['/menu', '/signaturepizza', '/otherpizza', '/specialoffer', '/sides', '/dips', '/drinks', '/create-your-own'].includes(location.pathname),
        },
        {
            label: 'Cart',
            icon: (
                <span style={{ position: 'relative', display: 'inline-block' }}>
                    <FaCartShopping size={20} />
                    {cartCount > 0 && (
                        <span className="bottom-nav-badge">
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </span>
            ),
            action: () => navigate('/addtocart'),
            active: isActive('/addtocart'),
        },
        {
            label: 'Account',
            icon: <FaUser size={20} />,
            action: () => navigate(isAuthenticated ? '/my-account' : '/login'),
            active: isActive('/my-account') || isActive('/login'),
        },
    ];

    return (
        <nav className="mobile-bottom-nav d-md-none">
            {navItems.map((item, i) => (
                <button
                    key={i}
                    className={`bottom-nav-item ${item.active ? 'active' : ''}`}
                    onClick={item.action}
                    aria-label={item.label}
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
