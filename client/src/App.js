import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* דף הבית */}
          <Route path="/" element={<HomePage />} />

          {/* דף ההרשמה */}
          <Route path="/register" element={<Register />} />

          {/* דף ההתחברות */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
