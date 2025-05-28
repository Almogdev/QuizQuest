import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProfilePage from "./pages/Profile/ProfilePage";
import LeaderboardPage from "./pages/Leaderboard/LeaderboardPage";

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
          <Route path="/leaderboard" element={<LeaderboardPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
