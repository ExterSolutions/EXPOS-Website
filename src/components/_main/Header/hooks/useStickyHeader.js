import { useState, useEffect, useRef } from 'react';

export const useStickyHeader = () => {
    const [isSticky, setIsSticky] = useState(false);
    const navbarRef = useRef(null);


    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const navbar = navbarRef.current;
        if (navbar) {
            document.body.style.paddingTop = isSticky
                ? `${navbar.offsetHeight}px`
                : "0px";
        }
    }, [isSticky]);

    return { isSticky, navbarRef };
};