// This is the main server file for the QuizQuest application.
const express = require("express");
const app = express();
const PORT = 3001;
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const functions = require("./functions");
const jwt = require("jsonwebtoken");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// SQL
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizquest",
  port: 3306,
});

// checking connection to DB
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MariaDB:", err.stack);
    return;
  }
  console.log("Connected to DB!");
});

// Static (React build)
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.static(path.join(__dirname, ".")));

// ==================== AUTH & USERS ====================

// Register (MVP – no password yet)
app.post("/api/register", async (req, res) => {
  const user_name = (req.body.username || "").trim();
  const schoolID = Number(req.body.schoolCode);
  const grade = req.body.grade ?? null;

  if (!user_name || !schoolID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const usernameExists = await functions.is_username_exists(user_name);
  if (usernameExists) {
    return res
      .status(400)
      .json({ message: "Username already taken. Please choose a different one." });
  }

  try {
    const exists = await functions.is_school_id_exists(schoolID);
    if (!exists) {
      return res.status(400).json({ message: "School ID does not exist." });
    }

    const sql =
      "INSERT INTO player_data (user_name, school_id, grade) VALUES (?, ?, ?)";
    connection.execute(sql, [user_name, schoolID, grade], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while registering the user." });
      }
      res
        .status(200)
        .json({ message: "User registered successfully!", userId: result.insertId });
    });
  } catch (err) {
    console.error("Error checking school ID:", err);
    return res.status(500).json({ message: "Error checking school ID." });
  }
});

// Login -> issues JWT and returns minimal user object
app.post("/api/login", (req, res) => {
  const { user_name, school_id } = req.body;
  console.log("BODY:", req.body);

  if (!user_name || !school_id) {
    return res
      .status(400)
      .json({ message: "Username and school ID are required." });
  }

  const query = `
    SELECT * FROM player_data
    WHERE user_name = ? AND school_id = ?
  `;

  connection.execute(
    query,
    [String(user_name).trim(), Number(school_id)],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while logging in." });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid username or school ID." });
      }

      const user = results[0];
      const token = jwt.sign(
        { id: user.id, user_name: user.user_name, school_id: user.school_id },
        "my_super_secret_key",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful!",
        token: token,
        user: {
          id: user.id,
          user_name: user.user_name,
          school_id: user.school_id,
        },
      });
    }
  );
});

// ==================== GAME SUBMIT (scores) ====================
app.post("/api/game/submit", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  let decoded;
  try {
    decoded = jwt.verify(token, "my_super_secret_key");
  } catch (e) {
    console.error("[/api/game/submit] jwt.verify error:", e?.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  const userId = decoded.id;
  const { quizId, scoreDelta } = req.body;
  const delta = Number(scoreDelta);
  const qid = Number(quizId);

  if (!Number.isFinite(qid) || !Number.isInteger(delta) || Math.abs(delta) > 100000) {
    console.warn("[/api/game/submit] invalid payload:", req.body);
    return res.status(400).json({ message: "Invalid payload" });
  }

  console.log("[/api/game/submit] start", { userId, quizId: qid, scoreDelta: delta });

  connection.beginTransaction((err) => {
    if (err) {
      console.error("[/api/game/submit] TX begin failed:", err?.message);
      return res.status(500).json({ message: "TX begin failed" });
    }

    // 1) update user (NULL-safe)
    const sqlUser =
      "UPDATE player_data SET personal_score = COALESCE(personal_score,0) + ? WHERE id = ?";
    connection.execute(sqlUser, [delta, userId], (e1, r1) => {
      if (e1) {
        console.error("[/api/game/submit] user update failed:", e1?.message);
        return connection.rollback(() =>
          res.status(500).json({ message: "User score update failed" })
        );
      }
      console.log("[/api/game/submit] user updated rows:", r1?.affectedRows);
      if (!r1?.affectedRows) {
        return connection.rollback(() =>
          res.status(404).json({ message: "User not found" })
        );
      }

      // 2) fetch user's school_id (מקור אמת)
      connection.execute(
        "SELECT school_id FROM player_data WHERE id = ? LIMIT 1",
        [userId],
        (e2, rows) => {
          if (e2) {
            console.error("[/api/game/submit] fetch school_id failed:", e2?.message);
            return connection.rollback(() =>
              res.status(500).json({ message: "Failed to read user's school" })
            );
          }
          if (!rows || rows.length === 0) {
            return connection.rollback(() =>
              res.status(404).json({ message: "User not found during school fetch" })
            );
          }

          const schoolId = Number(rows[0].school_id);
          console.log("[/api/game/submit] schoolId from player_data:", schoolId);

          // 3) update school by PK (NULL-safe)
          const sqlSchool =
            "UPDATE schools_data SET score = COALESCE(score,0) + ? WHERE id = ?";
          connection.execute(sqlSchool, [delta, schoolId], (e3, r3) => {
            if (e3) {
              console.error("[/api/game/submit] school update failed:", e3?.message);
              return connection.rollback(() =>
                res.status(500).json({ message: "School score update failed" })
              );
            }
            console.log("[/api/game/submit] school updated rows:", r3?.affectedRows);

            if (!r3?.affectedRows) {
              console.warn("[/api/game/submit] school not found by id", { schoolId });
              return connection.rollback(() =>
                res.status(404).json({ message: "School not found for this user" })
              );
            }

            // 4) commit
            connection.commit((eCommit) => {
              if (eCommit) {
                console.error("[/api/game/submit] TX commit failed:", eCommit?.message);
                return connection.rollback(() =>
                  res.status(500).json({ message: "TX commit failed" })
                );
              }
              console.log("[/api/game/submit] SUCCESS", { userId, schoolId, delta });
              return res.json({ ok: true });
            });
          });
        }
      );
    });
  });
});


// ==================== QUIZZES & QUESTIONS ====================

// Legacy-style: questions with numeric index (0-based) — still available if needed
app.get("/api/questions/:quiz_id", (req, res) => {
  const quiz_id = Number(req.params.quiz_id);
  if (!Number.isFinite(quiz_id) || quiz_id <= 0) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  const query = "SELECT * FROM questions WHERE quiz_id = ?";
  connection.execute(query, [quiz_id], (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const formattedQuestions = results.map((row) => ({
      question: row.question,
      answers: [row.answer_1, row.answer_2, row.answer_3, row.answer_4],
      correctAnswerIndex: Number(row.correct_answer) - 1, // assumes 1..4 in DB
    }));

    res.status(200).json(formattedQuestions);
  });
});

// New: questions with TEXT correctAnswer (for the new QuizGame.jsx)
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
      correct_answer   -- TEXT column
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
      const answers = [r.answer_1, r.answer_2, r.answer_3, r.answer_4]
        .map((v) => (v == null ? "" : String(v).trim()))
        .filter((s) => s !== "");
      const correctAnswer = String(r.correct_answer ?? "").trim();

      if (correctAnswer && !answers.includes(correctAnswer)) {
        console.warn(
          `[quiz ${quizId}] qid=${r.id} correct_answer not found in answers`,
          { correctAnswer, answers }
        );
      }

      return {
        id: r.id,
        question: r.question ?? "",
        answers,
        correctAnswer, // e.g., "4"
      };
    });

    res.status(200).json({
      quizId,
      count: questions.length,
      questions,
    });
  });
});

// Profile (JWT required)
app.get("/api/profile", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

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
      res.json(results[0]);
    });
  });
});

// get all quizzes
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

// leaderboard setup
app.get("/api/leaderboard", (req, res) => {
  console.log("📊 [Leaderboard] Request received...");

  const sql = `
    SELECT 
      id,
      name,
      city,
      score,
      logo
    FROM schools_data
    ORDER BY score DESC
    LIMIT 100
  `;

  connection.execute(sql, (err, rows) => {
    if (err) {
      console.error("❌ [Leaderboard] Database error:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (!rows || rows.length === 0) {
      console.warn("⚠️ [Leaderboard] No schools found in database.");
      return res.json([]);
    }

    const withRank = rows.map((r, i) => ({
      ...r,
      rank: i + 1
    }));

    console.log(`✅ [Leaderboard] Query successful! ${withRank.length} schools found.`);
    console.table(
      withRank.map((r) => ({
        Rank: r.rank,
        Name: r.name,
        City: r.city,
        Score: r.score
      }))
    );

    res.json(withRank);
  });
});



// ==================== CATCH-ALL (keep last) ====================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
