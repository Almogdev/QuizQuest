import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/QQ.png";
import Logo_connected from "../../assets/user.png";
import Logo_guest from "../../assets/guest.png";
import "./Header.css";

const Header = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("האם אתה בטוח שברצונך להתנתק?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserData(null);
      setMenuOpen(false);
      navigate("/");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button>⚙️ Settings</button>
        <button>🏠 Back to Home page</button>
      </div>

      <img src={Logo} alt="QuizQuest Logo" className="header-logo" />

      <div className="header-right">
        <img
          src={userData ? Logo_connected : Logo_guest}
          alt="Profile"
          className="profile-button"
          onClick={toggleMenu}
        />
        <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
          {!userData && <button onClick={handleLoginNavigate}>Log In</button>}
          <button onClick={() => navigate("/profile")}>My Profile</button>
          {userData && <button onClick={handleLogout}>Sign Out</button>}
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
