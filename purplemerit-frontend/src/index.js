import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Dashboard from "./Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));

const path = window.location.pathname;

root.render(
  <React.StrictMode>
    {path === "/dashboard" ? <Dashboard /> : <App />}
  </React.StrictMode>
);
