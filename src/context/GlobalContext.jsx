// src/context/GlobalContext.js
import { createContext, useState } from "react";


const DEFAULT_CITY = {
    value: "Calgary",
    label: "Calgary",
    stores: [{
        code: "STR_5",
        storeLocation: "Calgary",
        latitude: "51.102619",
        longitude: "-113.924528",
        storeAddress: "5 Coral Springs Blvd NE Unit#11, Calgary, AB T3J 4J1"
    }]
};

const DEFAULT_STORE = {
    value: "STR_5",
    label: "Calgary"
};

export const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

    const setDefaultCalgaryLocation = () => {
        localStorage.setItem('currentCity', JSON.stringify(DEFAULT_CITY));
        localStorage.setItem('currentStoreCode', DEFAULT_STORE.value);
        localStorage.setItem('currentStore', JSON.stringify(DEFAULT_STORE));
        return {
            city: DEFAULT_CITY,
            storeCode: DEFAULT_STORE.value,
            store: DEFAULT_STORE
        };
    };

    // Check if we need to set defaults
    const checkAndSetDefaults = () => {
        const storedCity = localStorage.getItem("currentCity");
        const storedStoreCode = localStorage.getItem("currentStoreCode");
        const storedStore = localStorage.getItem("currentStore");

        // If nothing is stored, set Calgary as default
        if (!storedCity && !storedStoreCode && !storedStore) {
            return setDefaultCalgaryLocation();
        }

        // Return existing data if available
        return {
            city: storedCity ? JSON.parse(storedCity) : null,
            storeCode: storedStoreCode,
            store: storedStore ? JSON.parse(storedStore) : null
        };
    };

    const defaultData = checkAndSetDefaults();

    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") ? true : false
    );
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : { product: [] };
    });
    const [currentStoreCode, setCurrentStoreCode] = useState(
        defaultData.storeCode || localStorage.getItem("currentStoreCode")
    );
    const [currentLatitude, setCurrentLatitude] = useState(
        localStorage.getItem("currentLatitude")
    );
    const [currentLogitude, setCurrentLogitude] = useState(
        localStorage.getItem("currentLogitude")
    );
    const [currentCity, setCurrentCity] = useState(
        defaultData.city || (() => {
            const storedCity = localStorage.getItem("currentCity");
            return storedCity ? JSON.parse(storedCity) : null;
        })()
    );
    const [currentStore, setCurrentStore] = useState(
        defaultData.store || (() => {
            const storedStore = localStorage.getItem("currentStore");
            return storedStore ? JSON.parse(storedStore) : null;
        })()
    );
    const [scrollToSignature, setScrollToSignature] = useState(false);
    const [selectedType, setSelectedType] = useState(() => {
        const storedType = localStorage.getItem("selectedType");
        if (storedType) {
            return storedType;
        } else {
            localStorage.setItem("selectedType", "pickup");
            return "pickup";
        }
    });
    const [payloadEdit, setPayloadEdit] = useState();
    const [showStorePopup, setShowStorePopup] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [url, setUrl] = useState(null);
    const [productType, setProductType] = useState();
    const [settings, setSettings] = useState();
    const [regUser, setRegUser] = useState(() => {
        const stored = localStorage.getItem("registeredUser");
        return stored ? JSON.parse(stored) : null;
    });
    const [reset, setReset] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    // Function to manually set Calgary as location
    const setCalgaryAsDefault = () => {
        setCurrentCity(DEFAULT_CITY);
        setCurrentStoreCode(DEFAULT_STORE.value);
        setCurrentStore(DEFAULT_STORE);
        localStorage.setItem('currentCity', JSON.stringify(DEFAULT_CITY));
        localStorage.setItem('currentStoreCode', DEFAULT_STORE.value);
        localStorage.setItem('currentStore', JSON.stringify(DEFAULT_STORE));
    };

    // Function to clear location and reset to Calgary
    const resetToCalgary = () => {
        setCalgaryAsDefault();
        setCurrentLatitude(null);
        setCurrentLogitude(null);
        localStorage.removeItem('currentLatitude');
        localStorage.removeItem('currentLogitude');
    };

    const value = {
        auth: [isAuthenticated, setIsAuthenticated],
        user: [user, setUser],
        regUser: [regUser, setRegUser],
        cart: [cart, setCart],
        productEdit: [payloadEdit, setPayloadEdit],
        urlPath: [url, setUrl],
        productType: [productType, setProductType],
        settings: [settings, setSettings],
        reset: [reset, setReset],
        sidebar: [showSidebar, setShowSidebar],
        currentStoreCode: [currentStoreCode, setCurrentStoreCode],
        currentCity: [currentCity, setCurrentCity],
        currentStore: [currentStore, setCurrentStore],
        scrollToSignature: [scrollToSignature, setScrollToSignature],
        selectedType: [selectedType, setSelectedType],
        showStorePopup: [showStorePopup, setShowStorePopup],
        currentLatitude: [currentLatitude, setCurrentLatitude],
        currentLogitude: [currentLogitude, setCurrentLogitude],
        mobileMenu: [openMobileMenu, setOpenMobileMenu],
        // Add helper functions
        setCalgaryAsDefault,
        resetToCalgary
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

// ALSO export as default for compatibility
export default GlobalContext;