import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";

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
