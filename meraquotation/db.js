// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10
// });

// module.exports = pool;


const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",     // apna host
  user: "root",          // apna mysql user
  password: "root",          // apna password
  database: "nsdatawebx_dsonik", // apna database name
});

module.exports = pool;

 // "start": "node app.js",
    // "dev": "nodemon app.js"