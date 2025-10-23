import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import bg from "../../assets/bg.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isGameStarted] = useState(false);

  return (
    <div className="app-container">
      <Header userData={userData} setUserData={setUserData} />

      <main className="home-main">
        {/* רקע זז מתחת לתוכן */}
        <div className="moving-bg" style={{ backgroundImage: `url(${bg})` }} />

        {/* תוכן מעל הרקע */}
        <div className="home-content">
          {!isGameStarted ? (
            <>
              <button onClick={() => navigate("/game-menu")}>Start Quiz</button>
              <button onClick={() => navigate("/map")}>Map</button>
              <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
