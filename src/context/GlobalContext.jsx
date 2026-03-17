import { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const getCookieData = () => {
    try {
      const cookies = document.cookie.split("; ");
      const storeCookie = cookies.find((row) => row.startsWith("ext_store="));
      if (storeCookie) {
        const base64 = storeCookie.split("=")[1];
        const scrambled = decodeURIComponent(escape(atob(base64)));

        // De-scramble using XOR and same secret key
        const SECRET = "exter_store_pizza";
        const json = scrambled.split('').map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join('');

        return JSON.parse(json);
      }
    } catch (e) {
      console.warn("[GlobalContext] Cookie parse error:", e);
    }
    return null;
  };

  const getStoredData = () => {
    // 1. Try Cookie first (cross-subdomain source of truth)
    const cookieData = getCookieData();
    if (cookieData) {
      const cityOption = {
        value: cookieData.city,
        label: cookieData.city,
        stores: [{
          code: cookieData.code,
          storeLocation: cookieData.storeLocation,
          latitude: cookieData.latitude,
          longitude: cookieData.longitude,
          storeAddress: cookieData.storeAddress,
        }],
      };
      const storeOption = {
        value: cookieData.code,
        label: cookieData.storeLocation || cookieData.city,
      };
      return { city: cityOption, storeCode: cookieData.code, store: storeOption, storeDetail: cookieData };
    }

    // 2. Fallback to LocalStorage
    const storedCity = localStorage.getItem("currentCity");
    const storedStoreCode = localStorage.getItem("currentStoreCode");
    const storedStore = localStorage.getItem("currentStore");
    const savedSelected = localStorage.getItem("selectedStore");

    return {
      city: storedCity ? JSON.parse(storedCity) : null,
      storeCode: storedStoreCode || null,
      store: storedStore ? JSON.parse(storedStore) : null,
      storeDetail: savedSelected ? JSON.parse(savedSelected) : null
    };
  };

  const storedData = getStoredData();

  const initSelectedStore = () => {
    return storedData.storeDetail;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync GlobalContext with Redux state (which is restored by redux-persist on reload)
  const reduxAuth = useSelector((state) => state.user);
  useEffect(() => {
    if (reduxAuth && reduxAuth.token) {
      if (!isAuthenticated) setIsAuthenticated(true);
      if (reduxAuth.data && !user) setUser(reduxAuth.data);
    }
  }, [reduxAuth, isAuthenticated, user]);
  const [cart, setCart] = useState(() => {
    // Cross-subdomain cart clearing logic:
    // If the city in the global cookie differs from the city last used on this subdomain,
    // it means the user just switched cities. Clear any stale cart.
    try {
      const cookieData = getCookieData();
      const cookieCity = cookieData?.city;

      // Compare with the city this specific subdomain remembers
      const storedCityRaw = localStorage.getItem("currentCity");
      let lastSubdomainCity = null;
      if (storedCityRaw) {
        lastSubdomainCity = JSON.parse(storedCityRaw)?.value || JSON.parse(storedCityRaw)?.city;
      }

      if (cookieCity && lastSubdomainCity && cookieCity !== lastSubdomainCity) {
        localStorage.removeItem("cart");
        // console.log("[GlobalContext] City mismatch detected between global cookie and subdomain storage. Cart cleared.");
        return { product: [] };
      }
    } catch (e) {
      // console.warn("[GlobalContext] Cart sync check error:", e);
    }

    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { product: [] };
  });
  const [currentStoreCode, setCurrentStoreCode] = useState(
    storedData.storeCode || null,
  );
  const [currentLatitude, setCurrentLatitude] = useState(
    storedData.storeDetail?.latitude || localStorage.getItem("currentLatitude") || null,
  );
  const [currentLogitude, setCurrentLogitude] = useState(
    storedData.storeDetail?.longitude || localStorage.getItem("currentLogitude") || null,
  );
  const [currentCity, setCurrentCity] = useState(storedData.city || null);
  const [currentStore, setCurrentStore] = useState(storedData.store || null);

  const [selectedStore, setSelectedStore] = useState(initSelectedStore);
  const [scrollToSignature, setScrollToSignature] = useState(false);
  const [selectedType, setSelectedType] = useState(() => {
    const storedType = localStorage.getItem("selectedType");
    if (storedType) return storedType;
    localStorage.setItem("selectedType", "pickup");
    return "pickup";
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

  // Helper: clear all store/city data
  const clearStoreSelection = () => {
    setCurrentCity(null);
    setCurrentStoreCode(null);
    setCurrentStore(null);
    setSelectedStore(null);
    setCurrentLatitude(null);
    setCurrentLogitude(null);
    localStorage.removeItem("currentCity");
    localStorage.removeItem("currentStoreCode");
    localStorage.removeItem("currentStore");
    localStorage.removeItem("selectedStore");
    localStorage.removeItem("currentLatitude");
    localStorage.removeItem("currentLogitude");

    // Clear root-domain cookie
    const hostname = window.location.hostname;
    const domain = hostname.endsWith('exter.ca') ? '.exter.ca' : hostname;
    document.cookie = `ext_store=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  // Helper: update selectedStore and keep all related slices in sync
  const updateSelectedStore = (storeDetail) => {
    setSelectedStore(storeDetail);
    localStorage.setItem("selectedStore", JSON.stringify(storeDetail));

    // Sync to root-domain cookie for cross-subdomain persistence
    if (storeDetail) {
      try {
        const hostname = window.location.hostname;
        const domain = hostname.endsWith('exter.ca') ? '.exter.ca' : hostname;
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

        // XOR Obfuscation
        const SECRET = "exter_store_pizza";
        const json = JSON.stringify(storeDetail);
        const scrambled = json.split('').map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join('');
        const encoded = btoa(unescape(encodeURIComponent(scrambled)));

        document.cookie = `ext_store=${encoded}; domain=${domain}; path=/; expires=${expires}; SameSite=Lax`;
      } catch (e) {
        console.warn("[GlobalContext] Failed to sync store cookie:", e);
      }
    }

    if (storeDetail) {
      const cityOption = {
        value: storeDetail.city,
        label: storeDetail.city,
        stores: [{
          code: storeDetail.code,
          storeLocation: storeDetail.storeLocation,
          latitude: storeDetail.latitude,
          longitude: storeDetail.longitude,
          storeAddress: storeDetail.storeAddress,
        }],
      };
      const storeOption = {
        value: storeDetail.code,
        label: storeDetail.storeLocation || storeDetail.city,
      };
      setCurrentCity(cityOption);
      setCurrentStoreCode(storeDetail.code);
      setCurrentStore(storeOption);
      setCurrentLatitude(storeDetail.latitude);
      setCurrentLogitude(storeDetail.longitude);
      localStorage.setItem("currentCity", JSON.stringify(cityOption));
      localStorage.setItem("currentStoreCode", storeDetail.code);
      localStorage.setItem("currentStore", JSON.stringify(storeOption));
    }
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
    // ── Store detail ──────────────────────────────────────────────────────────
    selectedStore: [selectedStore, setSelectedStore],
    updateSelectedStore,
    clearStoreSelection,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// ALSO export as default for compatibility
export default GlobalContext;
