import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./assets/styles/style.css";

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