const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config();

const HOST = process.env.HOST;
const USER = process.env.USER;
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;

const database = mysql.createConnection({
  host: HOST,
  user: USER,
  database: DATABASE,
  password: PASSWORD,
});

database.connect();

module.exports = database;
