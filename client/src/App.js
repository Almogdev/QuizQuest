import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProfilePage from "./pages/Profile/ProfilePage";
import MapPage from "./pages/map/map";
import GameMainMenu from "./pages/GameMainMenu/GameMainMenu";
import GamePage from "./pages/GamePage/GamePage";
import TestPage from "./pages/Tests/tests";
import Leaderboard from "./pages/Leaderboard/Leaderboard"

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

          {/* דף פרופיל */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* טבלת מובילים + מפה ארצית */}
          <Route path="/Map" element={<MapPage />} />

          {/* תפריט משחק */}
          <Route path="/game-menu" element={<GameMainMenu />} />

          {/* דף המשחק */}
          <Route path="/game/:id" element={<GamePage />} />

          {/* דף המשחק */}
          <Route path="/Leaderboard" element={<Leaderboard />} />

          {/* דף טסטים */}
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
