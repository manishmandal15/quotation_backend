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
  host: "103.118.17.180",     // apna host
  user: "nsdatawebx_dsonik_dev",          // apna mysql user
  password: "Dsonik@123",          // apna password
  database: "nsdatawebx_dsonik", // apna database name
});

module.exports = pool;

 // "start": "node app.js",
    // "dev": "nodemon app.js"