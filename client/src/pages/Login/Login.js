import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    school_id: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Raw response:", response);

    const result = await response.json();
    console.log("Parsed result:", result);

    if (response.ok) {
      setMessage("Login successful!");
      console.log("User logged in:", result);
    } else {
      setMessage(result.message || "Failed to login.");
    }
  } catch (err) {
    console.error("Error during login:", err);
    setMessage("Something went wrong. Please try again.");
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="message">{message}</p>}
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_name">Username</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="school_id">School Code</label>
          <input
            type="text"
            id="school_id"
            name="school_id"
            value={formData.school_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
