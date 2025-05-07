const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizquest',
  port: 3306
});

function is_school_id_exists(school_id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM schools_data WHERE id = ${school_id}`;
    console.log(query);

    connection.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      if (result.length > 0) {
        console.log("School ID found:", result);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function is_username_exists(username) {
  return new Promise((resolve, reject) => {
    const query = `SELECT user_name FROM player_data WHERE user_name = ?`;
    connection.query(query, [username], (err, result) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      if (result.length > 0) {
        console.log("Username already exists:", result);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Exports
module.exports = {
  is_school_id_exists,
  is_username_exists
}