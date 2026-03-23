import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./assets/styles/style.css";

import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./routes/AllRoutes";
import BottomNav from "./components/_main/BottomNav";


function App() {
    return (
        <div id="wrapper">
            <AllRoutes />
            {/* Mobile Bottom Navigation Bar */}
            <BottomNav />
            {/* Toast */}
            <ToastContainer hideProgressBar={false} position="top-right" />
        </div>
    );
}

export default App;