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
  const quiz_id = Number(req.params.quiz_id); // לוקח מה-URL

  const query = "SELECT * FROM questions WHERE quiz_id = ?";

  connection.execute(query, [quiz_id], (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const formattedQuestions = results.map((row) => ({
      question: row.question,
      answers: [row.answer_1, row.answer_2, row.answer_3, row.answer_4],
      correctAnswerIndex: row.correct_answer - 1,
    }));

    res.status(200).json(formattedQuestions);
  });
});


app.get("/api/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing token" });
  }

  // הוצאת הטוקן מתוך "Bearer ..."
  const token = authHeader.split(" ")[1];

  jwt.verify(token, "my_super_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;

    const query = `SELECT * FROM player_data WHERE id = ?`;

    connection.execute(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // שליחת פרטי המשתמש ללקוח
      const user = results[0];
      res.json(user);
    });
  });
});

//get all quizes
app.get("/api/quizzes", (req, res) => {
  const query = `
    SELECT q.id, q.name, q.category, q.difficulty, q.image_url,
           COUNT(ques.id) AS questions_count
    FROM quizzes q
    LEFT JOIN questions ques ON q.id = ques.quiz_id
    GROUP BY q.id
    ORDER BY q.id DESC
  `;
  connection.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching quizzes:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

//get 1 quiz
app.get("/api/questions/:quiz_id", (req, res) => {
  const quiz_id = req.params.quiz_id;

  const query = "SELECT * FROM questions WHERE quiz_id = ?";
  connection.execute(query, [quiz_id], (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // ממפים בדיוק לעמודות שלך: answer_1..answer_4 + correct_answer_index (1-based)
    const formatted = results.map((row) => {
      const answers = [
        row.answer_1,
        row.answer_2,
        row.answer_3,
        row.answer_4,
      ].map((x) => (x == null ? "" : String(x)));

      const zeroBased =
        Number.isFinite(Number(row.correct_answer_index)) &&
          row.correct_answer_index >= 1 &&
          row.correct_answer_index <= answers.length
          ? Number(row.correct_answer_index) - 1
          : 0;

      return {
        question: row.question ?? "",
        answers,
        correctAnswerIndex: zeroBased, // ← מחזירים 0-based ללקוח
      };
    });

    res.status(200).json(formatted);
  });
});

// GET all questions for a given quiz, with correct answer TEXT (no index)
app.get("/api/quiz/:quiz_id", (req, res) => {
  const quizId = Number(req.params.quiz_id);
  if (!Number.isFinite(quizId) || quizId <= 0) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  const sql = `
    SELECT
      id,
      quiz_id,
      question,
      answer_1, answer_2, answer_3, answer_4,
      correct_answer   -- TEXT column you added
    FROM questions
    WHERE quiz_id = ?
    ORDER BY id ASC
  `;

  connection.execute(sql, [quizId], (err, rows) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const questions = rows.map((r) => {
      // normalize to trimmed strings; drop empty answers so no "undefined" buttons
      const answers = [r.answer_1, r.answer_2, r.answer_3, r.answer_4]
        .map((v) => (v == null ? "" : String(v).trim()))
        .filter((s) => s !== "");

      const correctAnswer = String(r.correct_answer ?? "").trim();

      // helpful warning if DB has mismatch
      if (!answers.includes(correctAnswer)) {
        console.warn(
          `[quiz ${quizId}] qid=${r.id} correct_answer not found in answers`,
          { correctAnswer, answers }
        );
      }

      return {
        id: r.id,
        question: r.question ?? "",
        answers,               // ["4","5","6","3"]
        correctAnswer,         // e.g. "4"
      };
    });

    res.status(200).json({
      quizId,
      count: questions.length,
      questions,
    });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});