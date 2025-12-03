import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/QQ.png";
import Logo_connected from "../../assets/user.png";
import Logo_guest from "../../assets/guest.png";
import "./Header.css";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const Header = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // local fallback if no props are passed
  const [localUser, setLocalUser] = useState(getStoredUser());
  const user = userData ?? localUser;

  useEffect(() => {
    // initial load
    setLocalUser(getStoredUser());

    // keep in sync if login/logout happens in another tab
    const onStorage = () => setLocalUser(getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("האם אתה בטוח שברצונך להתנתק?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLocalUser(null);              // update internal state
      if (setUserData) setUserData(null); // respect external state if provided
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
        {/* <button>⚙️ Settings</button> */}
        <button onClick={() => navigate("/")}>🏠 Back to Home page</button>
      </div>

      <img src={Logo} alt="QuizQuest Logo" className="header-logo" />

      <div className="header-right">
        <img
          src={user ? Logo_connected : Logo_guest}
          alt="Profile"
          className="profile-button"
          onClick={toggleMenu}
        />
        <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
          {!user && <button onClick={handleLoginNavigate}>Log In</button>}
          <button onClick={() => navigate("/profile")}>My Profile</button>
          {user && <button onClick={handleLogout}>Sign Out</button>}
          <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
