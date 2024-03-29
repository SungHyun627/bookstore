const mariadb = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connnection = mariadb.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  dateStrings: true,
});

module.exports = connnection;
