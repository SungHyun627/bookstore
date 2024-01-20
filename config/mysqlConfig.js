const mariadb = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConnnection = async () => {
  const connection = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    dateStrings: true,
  });
  return connection;
};

module.exports = dbConnnection;
