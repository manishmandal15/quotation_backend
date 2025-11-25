const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,       // Max connections
//   queueLimit: 0              // Unlimited queue
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });


// module.exports = db;

// const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,       // Max connections
  queueLimit: 0              // Unlimited queue
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.code);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

module.exports = pool;
