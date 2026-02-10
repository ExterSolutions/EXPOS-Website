import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./assets/styles/style.css";
import "./assets/styles/colors.css";
import "./assets/styles/custom.css";
import "./assets/styles/responsive.css";
import "./assets/styles/main-item-card.css";
import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./routes/AllRoutes";

function App() {
    return (
        <div id="wrapper">
            <AllRoutes />
            {/* Toast */}
            <ToastContainer hideProgressBar={false} position="top-right" />
        </div>
    );
}

export default App;