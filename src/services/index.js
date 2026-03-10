import http from "./http";

export const getCheese = async (page, search, payload) => {
  const { data: response } = await http.get(`/cheese`);
  return response;
};

export const getCrust = async (page, search, payload) => {
  const { data: response } = await http.get(`/crust`);
  return response;
};

export const getSpecialBases = async (page, search, payload) => {
  const { data: response } = await http.get(`/specialbases`);
  return response;
};

export const getDips = async (page, search, payload) => {
  const { data: response } = await http.get(`/dips`);
  return response;
};

export const getDrinks = async (page, search, payload) => {
  const { data: response } = await http.get(`/soft-drinks`);
  return response;
};

export const getToppings = async (page, search, payload) => {
  const { data: response } = await http.get(`/toppings`);
  return response;
};

export const getAllIngredients = async (page, search, payload) => {
  const { data: response } = await http.get(`/all-ingredients`);
  return response;
};

export const getSides = async (page, search, payload) => {
  const { data: response } = await http.get(`/sides`);
  return response;
};

export const getSidesTypeWise = async (search) => {
  const { data: response } = await http.get(
    `/type-wise-searchable-sides?search=${search}`
  );
  return response;
};



export const getSignaturePizza = async (page, search, payload) => {
  const { data: response } = await http.get("/signature-pizzas");
  return response;
};

export const getHomePizzas = async (page, search, payload) => {
  const { data: response } = await http.get("/home/pizzas");
  return response;
};

export const getOtherPizza = async (storeCode) => {
  const { data: response } = await http.get(
    storeCode ? `/pizzas?storeCode=${storeCode}` : `/pizzas`
  );
  return response;
};

export const getStoreLocation = async (payload) => {
  const { data: response } = await http.get(
    `/store-locations?lat=${payload?.lat}&lng=${payload?.long}`
  );
  return response;
};

export const sendContactUsEmail = async (payload, page, search) => {
  const { data: response } = await http.post(`/sendContactUsEmail`, payload);
  return response;
};

export const deliverable = async (payload) => {
  const { data: response } = await http.post(
    "/zipcode/check/deliverable",
    payload
  );
  return response;
};

export const zipcodeServicable = async (payload) => {
  const { data: response } = await http.get(
    `/zipcode/serviceable?zipcode=${payload?.zipcode}&storeCode=${payload?.storeCode}`
  );
  return response;
};

// Developer: Shreyas Mahamuni, 22-11-2023
// It returns pizza prices for custom_pizza
export const getPizzaPrice = async () => {
  const { data: response } = await http.get(`/pizzaPrice`);
  return response;
};

// Get Special Pizza Requirements
export const getSpecialDetails = async (code, storeCode) => {
  const { data: response } = await http.get(
    storeCode
      ? `/special-offers/${code}?storeCode=${storeCode}`
      :
      `/special-offers/${code}`
  );
  return response;
};

// Get Store By Lat Long
export const getStoreByLatLong = async (lat, long) => {
  const { data: response } = await http.get(
    `/nearest-store?lat=${lat}&lng=${long}`
  );
  return response;
};

export const getSignatureDetails = async (code) => {
  const { data: response } = await http.get(`/signature-pizzas/${code}`);
  return response;
};

export const getOtherDetails = async (code, storeCode) => {
  const { data: response } = await http.get(
    storeCode ? `/pizzas/${code}?storeCode=${storeCode}` : `/pizzas/${code}`
  );
  return response;
};

export const specialIngredients = async (storeCode) => {
  const { data: response } = await http.get(
    storeCode ? `/special-offers?storeCode=${storeCode}` : `/special-offers`
  );
  return response;
};

// customer API
export const customerLogin = async (payload, page, search) => {
  const { data: response } = await http.post(`/customer/login`, payload);
  return response;
};
export const customerRegistration = async (payload, page, search) => {
  const { data: response } = await http.post(`/customer/register`, payload);
  return response;
};
export const customerLogout = async (page, search, payload) => {
  const { data: response } = await http.post(`/customer/logout`);
  return response;
};
export const updateProfile = async (payload, page, search) => {
  const { data: response } = await http.post(
    `/customer/updateProfile`,
    payload
  );
  return response;
};
export const customerAddAddress = async (page, search, payload) => {
  const { data: response } = await http.post(`/customer/addAddress`);
  return response;
};
export const customerUpdateAddress = async (page, search, payload) => {
  const { data: response } = await http.post(`customer/updateAddress`);
  return response;
};
export const customerDeleteAddress = async (page, search, payload) => {
  const { data: response } = await http.post(`customer/deleteAddress`);
  return response;
};
export const customerResetPassword = async (payload, page, search) => {
  const { data: response } = await http.post(
    `customer/reset/password`,
    payload
  );
  return response;
};
export const customerResendOtp = async (payload, page, search) => {
  const { data: response } = await http.post(`customer/resend/otp`, payload);
  return response;
};
export const changePassword = async (payload, page, search) => {
  const { data: response } = await http.post(
    `customer/changepassword`,
    payload
  );
  return response;
};
export const getStoreLocationByCity = async (page, search, payload) => {
  const { data: response } = await http.get(`customer/getstorelocationbycity`);
  return response;
};
export const getDynamicSlider = async (page, search, payload) => {
  const { data: response } = await http.get(`/dynamic-slider/web`);
  return response;
};

export const getVerifyToken = async (page, search, authToken) => {
  const { data: response } = await http.get(`verifyToken?token=${authToken}`);
  return response;
};
export const customerUpdatePassword = async (payload, page, search) => {
  const { data: response } = await http.post(
    `customer/update/password`,
    payload
  );
  return response;
};
export const customerVerifyOtp = async (payload, page, search) => {
  const { data: response } = await http.post(`customer/verify/otp`, payload);
  return response;
};
export const getCustomerDetails = async (page, search, authToken) => {
  const { data: response } = await http.get(
    `customer/detailsByToken?token=${authToken}`
  );
  return response;
};

export const orderPlace = async (payload, page, search, authToken) => {
  const { data: response } = await http.post("customer/order/place", payload);
  return response;
};

export const cancelOrder = async (orderCode) => {
  const { data } = await http.get(`customer/order/cancel/${orderCode}`);
  return data;
};

export const settingApi = async () => {
  const { data: response } = await http.get("settings");
  return response;
};

export const paymentVerified = async (payload) => {
  const { data: response } = await http.post("payment/verify", payload);
  return response;
};

export const paymentCancel = async (payload) => {
  const { data: response } = await http.post("payment/cancel", payload);
  return response;
};

export const getOrderList = async (payload) => {
  const { data: response } = await http.post("customer/order/getlist", payload);
  return response;
};

export const getPostalcodeList = async (payload) => {
  const { data: response } = await http.post("zipcode/list", payload);
  return response;
};

export const getOrderDetails = async (payload) => {
  const { data: response } = await http.post("customer/order/details", payload);
  return response;
};

export const getDynamicSlidersImage = async () => {
  const { data: response } = await http.get(`/dynamic-slider/app`);
  return response;
};

export const getPopularItems = async (page, search, payload, storeCode) => {
  // Added storeCode param
  const params = new URLSearchParams();
  if (storeCode) params.append("storeCode", storeCode); // Append if provided
  const { data: response } = await http.get(`/home?${params.toString()}`);
  return response;
};

export const getPizzaDetails = async (pizzaCode) => {
  const { data: response } = await http.get(`/pizza/${pizzaCode}`);
  return response;
};

export const searchProducts = async (query) => {
  const { data: response } = await http.get(`/search-products?search=${query}`);
  return response;
};

export const franchisePageBgImage = async () => {
  const { data: response } = await http.get(`/franchise/bgimage`);
  return response;
};

export const franchisePackages = async () => {
  const { data: response } = await http.get(`/franchise/sections`);
  return response;
};

export const franchiseRequest = async (payload) => {
  const { data: response } = await http.post(`/franchise/contact-us`, payload);
  return response;
};

export const aboutPage = async () => {
  const { data: response } = await http.get(`/feed/page/about`);
  return response;
};

export const termsPage = async () => {
  const { data: response } = await http.get(`/feed/page/terms`);
  return response;
};

export const privacyPage = async () => {
  const { data: response } = await http.get(`/feed/page/privacy`);
  return response;
};

export const refundPage = async () => {
  const { data: response } = await http.get(`/feed/page/refund`);
  return response;
};

export const footerContent = async () => {
  const { data: response } = await http.get(`/feed/footer`);
  return response;
};

export const fetchMenu = async () => {
  const { data: response } = await http.get(`/menu`);
  return response;
};

export const fetchSignaturePizzaDefaults = async (code) => {
  const { data: response } = await http.get(
    `/signature-pizza/defaults/${code}`
  );
  return response;
};

export const getSpecialOfferNew = async (code) => {
  const { data: response } = await http.get(`/special-offers-with-signature-pizza/${code}`);
  console.log('response', response)
  return response;
};

// List for SpecialOfferWithToppingsList → GET /special-offers-with-toppings?storeCode=...
export const getSpecialOffersWithToppingsList = async (storeCode) => {
  const { data: response } = await http.get(
    storeCode
      ? `/special-offers-with-toppings?storeCode=${storeCode}`
      : `/special-offers-with-toppings`
  );
  return response;
};


export const getSiteData = async () => {
  const { data: response } = await http.get(`/feed/site`);
  return response;
}

export const applyCoupon = async () => {
  const { data: response } = await http.get(`/coupon/list`);
  return response;
}