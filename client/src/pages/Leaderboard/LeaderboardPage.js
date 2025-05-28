import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("לא מחובר");
      return;
    }

    fetch("/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בקבלת הנתונים או שאין הרשאה");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData) return <p>טוען נתונים...</p>;

  return (
    <div className="profile-page">
      <h2>הפרופיל שלי</h2>
      <p><strong>שם משתמש:</strong> {userData.user_name}</p>
      <p><strong>קוד בית ספר:</strong> {userData.school_id}</p>
      {/* תוכל להוסיף פה שדות נוספים בעתיד */}
    </div>
  );
};

export default ProfilePage;
