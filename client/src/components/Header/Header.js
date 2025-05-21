import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/QQ.png";
import Logo_connected from "../../assets/user.png";
import Logo_guest from "../../assets/guest.png";

const Header = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
  const confirmLogout = window.confirm("האם אתה בטוח שברצונך להתנתק?");
  if (!confirmLogout) return;

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  setUserData(null);
  setMenuOpen(false);
  navigate("/");
};

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <header>
      <button>⚙️ Settings</button>
      <div className="logo-container">
        <img src={Logo} alt="QuizQuest Logo" className="logo" />
      </div>
      <div className="profile-container">
        <img
          src={userData ? Logo_connected : Logo_guest}
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
  );
};

export default Header;
