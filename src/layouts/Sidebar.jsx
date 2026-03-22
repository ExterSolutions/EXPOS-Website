// Sidebar.jsx — Legacy cart drawer replaced.
// Any code that sets showSidebar=true now gets redirected to /addtocart instead.
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

const Sidebar = () => {
  const globalCtx = useContext(GlobalContext);
  const navigate = useNavigate();
  const sidebarContext = globalCtx?.sidebar || [false, () => {}];
  const [showSidebar, setShowSidebar] = sidebarContext;

  useEffect(() => {
    if (showSidebar) {
      // Close the legacy drawer and redirect to the proper cart page
      setShowSidebar(false);
      navigate("/addtocart");
    }
  }, [showSidebar, setShowSidebar, navigate]);

  // Render nothing — cart UI lives at /addtocart
  return null;
};

export default Sidebar;
