import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Router>
        <React.StrictMode>
            <App apikey="e9348d9812c5496f86f205401230411" />
        </React.StrictMode>
    </Router>
);
