import React, { useState } from "react";
import "./HomePage.css";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";

const HomePage = () => {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className="app-container">
      <Header userData={userData} setUserData={setUserData} />

      <main>
        {!isGameStarted ? (
          <>
            <button>Start Quiz</button>
            <button>Create Quiz</button>
            <button>Leaderboard</button>
          </>
        ) : (
          <QuizGame />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
