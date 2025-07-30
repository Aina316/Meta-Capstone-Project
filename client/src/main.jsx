import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { LoaderProvider } from "./context/LoaderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
