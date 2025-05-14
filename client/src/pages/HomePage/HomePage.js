import React, { useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    setMenuOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="app-container">
      {/* Header - יעבור לקומפוננטה נפרדת בקרוב */}
      <header>
        <button>⚙️ Settings</button>
        <div className="logo-container">
          <img src="/assets/QQ.png" alt="QuizQuest Logo" className="logo" />
        </div>
        <div className="profile-container">
          <img
            src={userData ? "/assets/user.png" : "/assets/guest.png"}
            alt="Profile"
            className="profile-button"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="profile-menu">
              {!userData && <button onClick={handleLoginNavigate}>Log In</button>}
              {userData && <button onClick={handleLogout}>Sign Out</button>}
              <button onClick={handleRegister}>Register</button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main>
        {!isGameStarted ? (
          <>
            <button >Start Quiz</button>
            <button disabled={!userData}>Create Quiz</button>
            <button>Leaderboard</button>
          </>
        ) : (
          <QuizGame />
        )}
      </main>

      {/* Footer - גם הוא בדרך לפיצול */}
      <footer>
        <p>© QuizQuest</p>
      </footer>
    </div>
  );
};

export default HomePage;
