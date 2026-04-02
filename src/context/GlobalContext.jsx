import { createContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../redux/authProvider/actionType";
import CartFunction from "../components/cart";
import { settingApi } from "../services";
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const getCookieData = () => {
    try {
      const cookies = document.cookie.split("; ");
      const hostname = window.location.hostname;
      const rootDomain = hostname.endsWith('exter.ca') ? '.exter.ca' : hostname;

      // 1. Check for Transfer Cookie (Root Domain - set during redirects)
      const transferPair = cookies.find((row) => row.startsWith("ext_store_transfer="));
      if (transferPair) {
        const rawValue = transferPair.split("=")[1];
        const base64 = transferPair.substring("ext_store_transfer=".length);
        const scrambled = decodeURIComponent(escape(atob(base64)));
        const SECRET = "exter_store_pizza";
        const json = scrambled.split('').map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join('');
        
        // CONSUME: Delete from root domain so it doesn't affect other tabs on next refresh
        document.cookie = `ext_store_transfer=; domain=${rootDomain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        // PERSIST: Save it to the local subdomain cookie immediately so subsequent reloads work!
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `ext_store=${rawValue}; path=/; expires=${expires}; SameSite=Lax`;
        
        return JSON.parse(json);
      }

      // 2. Fallback to Local Cookie (Subdomain Specific)
      const localPair = cookies.find((row) => row.startsWith("ext_store="));
      if (localPair) {
        const base64 = localPair.substring("ext_store=".length);
        const scrambled = decodeURIComponent(escape(atob(base64)));
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

  const getAuthCookieData = () => {
    try {
      const cookies = document.cookie.split("; ");
      const authCookie = cookies.find((row) => row.startsWith("ext_auth="));
      if (authCookie) {
        const base64 = authCookie.substring("ext_auth=".length);
        const scrambled = decodeURIComponent(escape(atob(base64)));
        const SECRET = "exter_auth_pizza";
        const json = scrambled.split("").map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join("");
        return JSON.parse(json);
      }
    } catch (e) {
      // console.warn("[GlobalContext] Auth cookie parse error:", e);
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

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (localStorage.getItem("token")) return true;
    const fromCookie = getAuthCookieData();
    return fromCookie?.token ? true : false;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) return JSON.parse(storedUser);
    const fromCookie = getAuthCookieData();
    return fromCookie?.user || null;
  });

  // 1. Restore auth state to localStorage from root-domain cookie (needed for subdomains)
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      const fromCookie = getAuthCookieData();
      if (fromCookie?.token) {
        localStorage.setItem("token", fromCookie.token);
        if (fromCookie.user) {
          localStorage.setItem("user", JSON.stringify(fromCookie.user));
          // Sync to Redux as well
          dispatch({
            type: LOGIN_SUCCESS,
            payload: fromCookie.user,
            token: fromCookie.token,
          });
        }
        if (!isAuthenticated) setIsAuthenticated(true);
        if (!user && fromCookie.user) setUser(fromCookie.user);
      }
    }
  }, [dispatch]);

  // 2. Sync auth state to root-domain cookie for persistence across subdomains
  useEffect(() => {
    const hostname = window.location.hostname;
    const domain = hostname.endsWith("exter.ca") ? ".exter.ca" : hostname;

    if (isAuthenticated && user && localStorage.getItem("token")) {
      try {
        const token = localStorage.getItem("token");
        const authData = { token, user };
        const json = JSON.stringify(authData);
        const SECRET = "exter_auth_pizza";
        const scrambled = json.split("").map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join("");
        const encoded = btoa(unescape(encodeURIComponent(scrambled)));
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `ext_auth=${encoded}; domain=${domain}; path=/; expires=${expires}; SameSite=Lax`;
      } catch (e) {
        console.warn("[GlobalContext] Auth cookie sync error:", e);
      }
    } else if (isAuthenticated === false) {
      // Explicit logout
      document.cookie = `ext_auth=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }, [isAuthenticated, user]);

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

      if (cookieCity && lastSubdomainCity && cookieCity.trim().toLowerCase() !== lastSubdomainCity.trim().toLowerCase()) {
        localStorage.removeItem("cart");
        // console.log(`[GlobalContext] City mismatch: Cookie(${cookieCity}) vs Local(${lastSubdomainCity}). Cart cleared.`);
        
        // Update localStorage to match cookie so we don't clear again on next reload
        const newCityOption = {
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
        localStorage.setItem("currentCity", JSON.stringify(newCityOption));
        localStorage.setItem("currentStoreCode", cookieData.code);
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

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingApi();
        if (res?.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("[GlobalContext] Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Recalculate cart totals whenever store or settings change
  useEffect(() => {
    // GUARD: Only recalculate if we have settings (to avoid zeroing out charges on initial load)
    if (selectedStore && cart?.product?.length > 0 && settings) {
      const cartFn = new CartFunction();
      cartFn.updateCartTotals(cart, setCart, settings, selectedStore);
    }
  }, [selectedStore, settings]);

  // FIX FOR STALE LOCALSTORAGE: Aggressively sync the state out to localStorage
  // This ensures that legacy components invoking cartFn.addCart without passing selectedStore 
  // will correctly fall back to a perfectly synced localStorage representation.
  useEffect(() => {
    if (selectedStore && selectedStore !== null) {
      localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
      if (selectedStore.code) {
        localStorage.setItem("currentStoreCode", selectedStore.code);
        localStorage.setItem("currentStore", JSON.stringify({
          value: selectedStore.code,
          label: selectedStore.storeLocation || selectedStore.city
        }));
      }
    }
  }, [selectedStore]);

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

    const hostname = window.location.hostname;
    const rootDomain = hostname.endsWith('exter.ca') ? '.exter.ca' : hostname;

    // Clear root-domain transfer cookie
    document.cookie = `ext_store_transfer=; domain=${rootDomain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // Clear root-domain store cookie if any legacy ones exist
    document.cookie = `ext_store=; domain=${rootDomain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // Clear local subdomain store cookie
    document.cookie = `ext_store=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  // Helper: update selectedStore and keep all related slices in sync
  const updateSelectedStore = (storeDetail) => {
    setSelectedStore(storeDetail);
    localStorage.setItem("selectedStore", JSON.stringify(storeDetail));

    // Sync to cookie, but isolate to current subdomain
    if (storeDetail) {
      try {
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

        // XOR Obfuscation
        const SECRET = "exter_store_pizza";
        const json = JSON.stringify(storeDetail);
        const scrambled = json.split('').map((char, i) =>
          String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join('');
        const encoded = btoa(unescape(encodeURIComponent(scrambled)));

        // Set LOCAL subdomain cookie (no generic domain=... ensures exact match)
        // This prevents Calgary selection from appearing on Brampton subdomain
        document.cookie = `ext_store=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
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
