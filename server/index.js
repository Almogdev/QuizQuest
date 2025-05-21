// This is the main server file for the QuizQuest application.
const express = require("express");
const app = express();
const PORT = 3001;
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const functions = require('./functions');
const jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//SQL 
const mysql = require('mysql2');
const { log, error } = require("console");
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizquest',
  port: 3306
});

//checking connection to DB
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MariaDB:', err.stack);
    return;
  }
  console.log('Connected to DB!');
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.use(express.json());

app.use(express.static(path.join(__dirname, ".")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.post("/api/register", async (req, res) => {
  let user_name = req.body.username;
  let schoolID = req.body.schoolCode;
  let grade = req.body.grade;

  let query = `INSERT INTO player_data (user_name, school_id, grade) VALUES ('${user_name}', ${schoolID}, '${grade}')`;

  if (!user_name || !schoolID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const usernameExists = await functions.is_username_exists(user_name);
  if (usernameExists) {
    return res.status(400).json({ message: "Username already taken. Please choose a different one." });
  }

  try {
    const exists = await functions.is_school_id_exists(schoolID);
    if (exists) {
      connection.execute(query, function (err, result) {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ message: "An error occurred while registering the user." });
        }
        res.status(200).json({
          message: "User registered successfully!",
          userId: result.insertId,
        });
      });
    } else {
      return res.status(400).json({ message: "School ID does not exist." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error checking school ID." });
  }
});

app.post("/api/login", (req, res) => {
const { user_name, school_id } = req.body;
  console.log("BODY:", req.body);
  if (!user_name || !school_id) {
    return res.status(400).json({ message: "Username and school ID are required." });
  }

  const query = `
    SELECT * FROM player_data
    WHERE user_name = ? AND school_id = ?
  `;

  connection.execute(query, [user_name, school_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "An error occurred while logging in." });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or school ID." });
    }

    // User found
    const user = results[0];
    const token = jwt.sign(
      { id: user.id, name: user.user_name, school_id: user.school_id },
      "my_super_secret_key", //
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        school_id: user.school_id,
      },
    });
  });

});

app.get("/api/questions/:quiz_id", (req, res) => {
  const quizId = req.params.quiz_id;

  const query = "SELECT * FROM questions WHERE quiz_id = ?";
  
  connection.execute(query, [quizId], (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Database error" });
    }ש
    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});