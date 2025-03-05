// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/index.css";

// Mock TWK implementation for development
if (!window.TWK) {
  window.TWK = {
    getUserId: () =>
      Promise.resolve({ success: true, result: { data: "1234567890" } }),
    getUserFullName: () =>
      Promise.resolve({ success: true, result: { data: "عبدالله محمد" } }),
    getUserGender: () =>
      Promise.resolve({ success: true, result: { data: "male" } }),
    getUserBirthDate: () =>
      Promise.resolve({ success: true, result: { data: "1990-01-01" } }),
    getUserBloodType: () =>
      Promise.resolve({ success: true, result: { data: "O+" } }),
    addDocument: (
      name: string,
      content: string,
      reference: string,
      category: number
    ) => Promise.resolve({ success: true }),
    updateDocument: (
      name: string,
      content: string,
      reference: string,
      category: number
    ) => Promise.resolve({ success: true }),
    deleteDocument: (reference: string, category: number) =>
      Promise.resolve({ success: true }),
    version: "1.8",
  };
  window.TWKAPIBASE = "https://api.tawakkalna.app";
}

// Make TWK global for TypeScript
declare global {
  interface Window {
    TWK: any;
    TWKAPIBASE: string;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
