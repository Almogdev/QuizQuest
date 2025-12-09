import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState("");       

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    fetch("/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // send JWT to server
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load profile data");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="profile-page">
        {/* error state */}
        {error && <p className="error">{error}</p>}

        {/* loading state */}
        {!error && !userData && <p>Loading profile...</p>}

        {/* success state */}
        {userData && (
          <div className="profile-card">
            <h2>My profile</h2>

            <div className="profile-info">
              <p>
                <strong>Username:</strong> {userData.user_name}
              </p>
              <p>
                <strong>School code:</strong> {userData.school_id}
              </p>
              <p>
                <strong>Grade:</strong> {userData.grade || "—"}
              </p>
              <p>
                <strong>User ID:</strong> {userData.id}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
