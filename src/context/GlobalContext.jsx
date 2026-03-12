import { createContext, useState } from "react";
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const getStoredData = () => {
    const storedCity = localStorage.getItem("currentCity");
    const storedStoreCode = localStorage.getItem("currentStoreCode");
    const storedStore = localStorage.getItem("currentStore");
    return {
      city: storedCity ? JSON.parse(storedCity) : null,
      storeCode: storedStoreCode || null,
      store: storedStore ? JSON.parse(storedStore) : null,
    };
  };

  const readStoreFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("d");
      if (encoded) {
        const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const json = decodeURIComponent(escape(atob(padded)));
        const p = JSON.parse(json);
        const storeDetail = {
          code: p.store_code || "",
          city: p.store_city || "",
          storeLocation: p.store_location || p.store_city || "",
          storeAddress: p.store_address || "",
          pickupNumber: p.store_phone || "",
          latitude: p.store_lat || "",
          longitude: p.store_lng || "",
        };
        if (!storeDetail.code) return null;
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
        localStorage.setItem("currentCity", JSON.stringify(cityOption));
        localStorage.setItem("currentStoreCode", storeDetail.code);
        localStorage.setItem("currentStore", JSON.stringify(storeOption));
        localStorage.setItem("selectedStore", JSON.stringify(storeDetail));

        return { city: cityOption, storeCode: storeDetail.code, store: storeOption, storeDetail };
      }

      const code = params.get("store_code");
      if (!code) return null;

      const storeDetail = {
        code,
        city: params.get("store_city") || "",
        storeLocation: params.get("store_location") || params.get("store_city") || "",
        storeAddress: params.get("store_address") || "",
        pickupNumber: params.get("store_phone") || "",
        latitude: params.get("store_lat") || "",
        longitude: params.get("store_lng") || "",
      };

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

      localStorage.setItem("currentCity", JSON.stringify(cityOption));
      localStorage.setItem("currentStoreCode", storeDetail.code);
      localStorage.setItem("currentStore", JSON.stringify(storeOption));
      localStorage.setItem("selectedStore", JSON.stringify(storeDetail));

      return { city: cityOption, storeCode: storeDetail.code, store: storeOption, storeDetail };
    } catch (e) {
      console.warn("[GlobalContext] Failed to parse store from URL:", e);
      return null;
    }
  };

  const urlData = readStoreFromUrl();
  const storedData = urlData || getStoredData();

  const initSelectedStore = () => {
    if (urlData?.storeDetail) return urlData.storeDetail;
    try {
      const saved = localStorage.getItem("selectedStore");
      if (saved) return JSON.parse(saved);

      // Build from currentCity + currentStoreCode if available
      const storedCity = localStorage.getItem("currentCity");
      const storedStoreCode = localStorage.getItem("currentStoreCode");
      if (storedCity && storedStoreCode) {
        const cityData = JSON.parse(storedCity);
        const matchedStore =
          (cityData.stores ?? []).find((s) => s.code === storedStoreCode) ||
          cityData.stores?.[0];
        if (matchedStore) {
          return {
            code: storedStoreCode,
            city: cityData.value || cityData.label || "",
            storeLocation: matchedStore.storeLocation || cityData.value || "",
            storeAddress: matchedStore.storeAddress || "",
            pickupNumber: matchedStore.pickup_number || "",
            latitude: matchedStore.latitude || "",
            longitude: matchedStore.longitude || "",
          };
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false,
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
    storedData.storeCode || null,
  );
  const [currentLatitude, setCurrentLatitude] = useState(
    urlData?.storeDetail?.latitude || localStorage.getItem("currentLatitude") || null,
  );
  const [currentLogitude, setCurrentLogitude] = useState(
    urlData?.storeDetail?.longitude || localStorage.getItem("currentLogitude") || null,
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
  };

  // Helper: update selectedStore and keep all related slices in sync
  const updateSelectedStore = (storeDetail) => {
    setSelectedStore(storeDetail);
    localStorage.setItem("selectedStore", JSON.stringify(storeDetail));

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
