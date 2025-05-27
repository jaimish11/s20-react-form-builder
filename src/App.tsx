import React from "react";
import { Header } from "./features/shared";
import { BuildForm, ViewFormNew } from "./features/form-builder";
import { FormSubmissions } from "./features/form-submissions";
import "./styles.css";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <div className="padding-1">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/s20" replace />} />
        <Route
          path="/s20"
          element={<Navigate to="/s20/build-form" replace />}
        />
        <Route path="/s20/build-form" element={<BuildForm />} />
        <Route path="/s20/view-form/:form?" element={<ViewFormNew />} />
        <Route
          path="/s20/view-submissions/:form?"
          element={<FormSubmissions />}
        />
      </Routes>
    </div>
  );
}
