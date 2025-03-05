import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
// Mock TWK implementation for development
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
  addDocument: (name, content, reference, category) =>
    Promise.resolve({ success: true }),
  updateDocument: (name, content, reference, category) =>
    Promise.resolve({ success: true }),
  deleteDocument: (reference, category) => Promise.resolve({ success: true }),
  version: "1.8",
};

// Define TWK API base endpoint for testing
window.TWKAPIBASE = "https://api.tawakkalna.app";
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
