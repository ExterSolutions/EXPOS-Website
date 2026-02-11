import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
// import "../../assets/styles/new/header/submenupizzas.css"; 



const SubMenuPizzas = ({
  isAuthenticated = false,
  cart = { grandtotal: 0 },
  handleOrderNowClick = () => {},
  handleCartBarToggle = () => {},
  menuData = [],
  placeholderImage = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const Tabs = () => {
    const tabRefs = useRef({});

    useEffect(() => {
      const activeTab = tabRefs.current[location.pathname];
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, [location]);

    const tabItems = [
      { path: "/create-your-own", label: "Create Your Own" },
      { path: "/specialoffer", label: "Deals" },
      { path: "/signaturepizza", label: "Signature Pizzas" },
      { path: "/otherpizza", label: "Other Pizzas" },
      { path: "/sides", label: "Sides" },
      { path: "/dips", label: "Dips" },
      { path: "/drinks", label: "Drinks" },
    ];

    return (
      <div className="tabs-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 pd0 BgsecondaryBlackColor">
              <div className="tabs-block mt-1">
                <ul className="tabs-list" role="tablist">
                  {tabItems.map(({ path, label }) => (
                    <li className="tab-item" key={path}>
                      <button
                        ref={(el) => (tabRefs.current[path] = el)}
                        onClick={() => navigate(path)}
                        className={`tab-button ${
                          location.pathname === path ? "active" : ""
                        }`}
                        id={`${label.toLowerCase().replace(/\s/g, "-")}-tab`}
                        type="button"
                        role="tab"
                        aria-controls={label
                          .toLowerCase()
                          .replace(/\s/g, "-")}
                        aria-selected={location.pathname === path}
                      >
                        <span>{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleAddToCart = (item) => {
    navigate(`/cart?add=${item.id}`);
  };

  return (
    <div className="sub-menu-pizzas">
      <Tabs />

      <div className="container-fluid mt-4">
        <h2 className="text-center">
          {location.pathname.replace("/", "").replace("-", " ") ||
            "Menu Section"}
        </h2>
      </div>

      <section className="menu-grid container-fluid">
        {menuData.length === 0 ? (
          <div className="text-center py-5">
            <p>No items available in this section.</p>
          </div>
        ) : (
          <div className="row g-4">
            {menuData.map((item) => (
              <div
                key={item.id}
                className="col-12 col-sm-6 col-md-4"
              >
                <div className="card h-100">
                  {item.imageUrl || placeholderImage ? (
                    <img
                      src={item.imageUrl || placeholderImage}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  ) : null}
                  <div className="card-body">
                    <h5>{item.name}</h5>
                    {item.ingredients && (
                      <p className="text-muted">{item.ingredients}</p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h6">${item.price?.toFixed(2) ?? "N/A"}</span>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SubMenuPizzas;