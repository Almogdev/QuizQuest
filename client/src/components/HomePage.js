import React, { useState } from "react";
import "./HomePage.css";
import logo from "../assets/QQ.png";
import guestImage from "../assets/guest.png";
import userImage from "../assets/user.png"; // תמונת משתמש קבועה
import { useNavigate } from "react-router-dom";
import QuizGame from "./QuizGame";

const HomePage = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });

  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setMenuOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="app-container">
      <header>
        <button>⚙️ Settings</button>
        <div className="logo-container">
          <img src={logo} alt="QuizQuest Logo" className="logo" />
        </div>
        <div className="profile-container">
          <img
            src={isLoggedIn ? userImage : guestImage}
            alt="Profile"
            className="profile-button"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="profile-menu">
              {!isLoggedIn && <button onClick={handleLoginNavigate}>Log In</button>}
              {isLoggedIn && <button onClick={handleLogout}>Sign Out</button>}
              <button onClick={handleRegister}>Register</button>
            </div>
          )}
        </div>
      </header>

      <main>
        {!isGameStarted ? (
          <>
            <button onClick={() => setIsGameStarted(true)}>Start Quiz</button>
            <button disabled={!isLoggedIn}>Create Quiz</button>
            <button>Leaderboard</button>
          </>
        ) : (
          <QuizGame />
        )}
      </main>

      <footer>
        <p>© QuizQuest</p>
      </footer>
    </div>
  );
};

export default HomePage;
