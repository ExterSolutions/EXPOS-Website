// src/components/_main/BottomNav.jsx
// Mobile bottom navigation bar - shown only on small screens
import { useContext } from 'react';
import { FaHome, FaPizzaSlice, FaUser } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { NavLink, useLocation } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';

const BottomNav = () => {
    const location = useLocation();
    const globalCtx = useContext(GlobalContext);

    const [cart] = globalCtx?.cart || [{ product: [] }];
    const [isAuthenticated] = globalCtx?.auth || [false];

    const cartCount = cart?.product?.length || 0;

    const menuPaths = ['/menu', '/signaturepizza', '/otherpizza', '/specialoffer', '/sides', '/dips', '/drinks', '/create-your-own', '/flex-deals'];
    const isMenuActive = menuPaths.some(p => location.pathname.startsWith(p));

    const navLinkClass = (isActive) =>
        `bottom-nav-item${isActive ? ' active' : ''}`;

    return (
        <nav className="mobile-bottom-nav d-md-none" aria-label="Mobile navigation">
            <NavLink
                to="/"
                end
                className={({ isActive }) => navLinkClass(isActive)}
                aria-label="Home"
            >
                <span className="bottom-nav-icon"><FaHome size={20} /></span>
                <span className="bottom-nav-label">Home</span>
            </NavLink>

            <NavLink
                to="/menu"
                className={() => navLinkClass(isMenuActive)}
                aria-label="Menu"
            >
                <span className="bottom-nav-icon"><FaPizzaSlice size={20} /></span>
                <span className="bottom-nav-label">Menu</span>
            </NavLink>

            <NavLink
                to="/cart"
                className={({ isActive }) => navLinkClass(isActive)}
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            >
                <span className="bottom-nav-icon" style={{ position: 'relative', display: 'inline-block' }}>
                    <FaCartShopping size={20} />
                    {cartCount > 0 && (
                        <span className="bottom-nav-badge">
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </span>
                <span className="bottom-nav-label">Cart</span>
            </NavLink>

            <NavLink
                to={isAuthenticated ? '/my-account' : '/login'}
                className={({ isActive }) => navLinkClass(isActive)}
                aria-label="Account"
            >
                <span className="bottom-nav-icon"><FaUser size={20} /></span>
                <span className="bottom-nav-label">Account</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;

