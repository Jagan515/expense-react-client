import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import axios from "axios";
import App from "./App.jsx";

axios.defaults.withCredentials = true;
import { store } from "./store.js";

import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
