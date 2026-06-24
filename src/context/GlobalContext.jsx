import { createContext, useState, useEffect, useMemo } from "react";
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

    if (storedCity || storedStoreCode) {
      return {
        city: storedCity ? JSON.parse(storedCity) : null,
        storeCode: storedStoreCode || null,
        store: storedStore ? JSON.parse(storedStore) : null,
        storeDetail: savedSelected ? JSON.parse(savedSelected) : null
      };
    }

    // 3. DEV ONLY: Pre-seed from .env.local so the store popup is skipped locally.
    //    VITE_DEV_STORE_CODE is only set in .env.local — never in .env — so this
    //    block is completely dead in production.
    const devStoreCode = import.meta.env.VITE_DEV_STORE_CODE;
    const devCity = import.meta.env.VITE_DEV_STORE_CITY;
    if (devStoreCode && devCity) {
      const cityOption = {
        value: devCity,
        label: devCity,
        stores: [{ code: devStoreCode, storeLocation: devCity }],
      };
      const storeOption = { value: devStoreCode, label: devCity };
      const storeDetail = { code: devStoreCode, city: devCity, storeLocation: devCity };
      // Persist so subsequent renders (and useStorePopup) pick it up from localStorage
      localStorage.setItem("currentCity", JSON.stringify(cityOption));
      localStorage.setItem("currentStoreCode", devStoreCode);
      localStorage.setItem("currentStore", JSON.stringify(storeOption));
      localStorage.setItem("selectedStore", JSON.stringify(storeDetail));
      return { city: cityOption, storeCode: devStoreCode, store: storeOption, storeDetail };
    }

    return { city: null, storeCode: null, store: null, storeDetail: null };
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
  // ── Order-type gate (shown after store selection) ─────────────────────────
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [pendingStoreForOrderType, setPendingStoreForOrderType] = useState(null);
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

  // ── Store Hours: compute isOpen from selectedStore (storelocation table) ─────
  //
  // The storelocation API returns: start_time, end_time, timezone
  // e.g. start_time="11:00 AM", end_time="10:00 PM", timezone="America/Vancouver"
  //
  // Fallback: if selectedStore has no hours, try global settings shortcodes
  // (open_time / close_time) — kept for backward compat.
  //
  // IMPORTANT: always compare in the STORE'S timezone, not the browser's local time.
  const storeOpen = useMemo(() => {

    // ── Helper: parse "HH:MM AM/PM" or "HH:MM" → minutes since midnight ──
    const parseTime = (str) => {
      if (!str) return null;
      const s = str.toString().trim().toUpperCase();
      const ampm = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
      if (ampm) {
        let h = parseInt(ampm[1], 10);
        const m = parseInt(ampm[2], 10);
        if (ampm[3] === 'PM' && h !== 12) h += 12;
        if (ampm[3] === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      }
      const hhmm = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (hhmm) return parseInt(hhmm[1], 10) * 60 + parseInt(hhmm[2], 10);
      return null;
    };

    // ── Helper: get current H*60+M in a given IANA timezone ──
    const currentMinutesInTz = (tz) => {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric', minute: 'numeric', hour12: false,
          timeZone: tz,
        }).formatToParts(new Date());
        const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
        const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
        return h * 60 + m;
      } catch {
        // Bad timezone string — fall back to browser local time
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
      }
    };

    // ── Primary: use selectedStore hours (storelocation table) ──
    if (selectedStore) {
      const openRaw  = selectedStore.start_time;
      const closeRaw = selectedStore.end_time;
      const tz       = selectedStore.timeZone || selectedStore.timezone; // API returns 'timeZone'

      if (openRaw && closeRaw) {
        const openMin  = parseTime(openRaw);
        const closeMin = parseTime(closeRaw);
        if (openMin !== null && closeMin !== null) {
          const current = tz ? currentMinutesInTz(tz) : (() => {
            const now = new Date(); return now.getHours() * 60 + now.getMinutes();
          })();
          if (closeMin > openMin) return current >= openMin && current < closeMin;
          return current >= openMin || current < closeMin; // overnight
        }
      }
    }

    // ── Fallback: global settings shortcodes ──
    if (!settings || !Array.isArray(settings)) return true; // not loaded yet → assume open

    const find = (code) => settings.find((s) => s.shortCode === code)?.settingValue ?? null;
    const openRaw  = find('open_time')  ?? find('opening_time')  ?? find('store_open_time');
    const closeRaw = find('close_time') ?? find('closing_time')  ?? find('store_close_time');
    if (!openRaw || !closeRaw) return true; // not configured → always open

    const openMin  = parseTime(openRaw);
    const closeMin = parseTime(closeRaw);
    if (openMin === null || closeMin === null) return true;

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    if (closeMin > openMin) return current >= openMin && current < closeMin;
    return current >= openMin || current < closeMin;

  }, [selectedStore, settings]);

  // Format hours string for display in the Kitchen Closed modal and banner
  const storeHoursString = useMemo(() => {
    // Primary: selectedStore hours
    if (selectedStore?.start_time && selectedStore?.end_time) {
      return `${selectedStore.start_time} – ${selectedStore.end_time}`;
    }
    // Fallback: global settings
    if (!settings || !Array.isArray(settings)) return null;
    const find = (code) => settings.find((s) => s.shortCode === code)?.settingValue ?? null;
    const openRaw  = find('open_time')  ?? find('opening_time')  ?? find('store_open_time');
    const closeRaw = find('close_time') ?? find('closing_time')  ?? find('store_close_time');
    if (!openRaw || !closeRaw) return null;
    const fmt = (str) => {
      const s = str.toString().trim().toUpperCase();
      const ampm = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
      if (ampm) return str.trim();
      const hhmm = s.match(/^(\d{1,2}):(\d{2})$/);
      if (hhmm) {
        let h = parseInt(hhmm[1], 10), m = parseInt(hhmm[2], 10);
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12 === 0 ? 12 : h % 12;
        return `${h}:${m.toString().padStart(2,'0')} ${period}`;
      }
      return str;
    };
    return `${fmt(openRaw)} – ${fmt(closeRaw)}`;
  }, [selectedStore, settings]);



  // Sync storeOpen to window so cart.jsx (plain class) can access it without circular imports
  useEffect(() => {
    window.__storeOpen        = storeOpen;
    window.__storeHoursString = storeHoursString;
  }, [storeOpen, storeHoursString]);

  // Recalculate cart totals whenever store or settings change
  useEffect(() => {
    // GUARD: Only recalculate if we have settings (to avoid zeroing out charges on initial load)
    if (selectedStore && cart?.product?.length > 0 && settings) {
      const cartFn = new CartFunction();
      cartFn.updateCartTotals(cart, setCart, settings, selectedStore);
    }
  }, [selectedStore, settings]);

  // Cart revalidation: strip flex deal items that are incompatible with the new order type.
  // e.g. if user switches to Delivery, remove any pickupdeal-only items from cart.
  useEffect(() => {
    if (!selectedType || !cart?.product?.length) return;
    const invalid = cart.product.filter((item) => {
      if (item.productType !== 'flex_deal') return false;
      if (selectedType === 'delivery' && item.dealType === 'pickupdeal') return true;
      if (selectedType === 'pickup'   && item.dealType === 'deliverydeal') return true;
      return false;
    });
    if (invalid.length > 0) {
      const stripped = cart.product.filter((item) => !invalid.includes(item));
      const cf = new CartFunction();
      cf.addCart(stripped, setCart, false, settings);
      // Import toast lazily to avoid circular dep — use a custom event instead
      invalid.forEach((item) => {
        const msg = `"${item.productName}" removed — only valid for ${item.dealType === 'pickupdeal' ? 'pickup' : 'delivery'} orders.`;
        window.dispatchEvent(new CustomEvent('cart-revalidation-toast', { detail: msg }));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

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
    showOrderTypeModal: [showOrderTypeModal, setShowOrderTypeModal],
    pendingStoreForOrderType: [pendingStoreForOrderType, setPendingStoreForOrderType],
    currentLatitude: [currentLatitude, setCurrentLatitude],
    currentLogitude: [currentLogitude, setCurrentLogitude],
    mobileMenu: [openMobileMenu, setOpenMobileMenu],
    selectedStore: [selectedStore, setSelectedStore],
    updateSelectedStore,
    clearStoreSelection,
    // ── Store hours ───────────────────────────────────────────────────────────
    storeOpen,
    storeHoursString,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// ALSO export as default for compatibility
export default GlobalContext;
