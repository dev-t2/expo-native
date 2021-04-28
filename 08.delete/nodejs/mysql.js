const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect();

connection.query('SELECT * from topic', (error, results) => {
  if (error) {
    console.error(error);
  }

  console.log(results);
});

connection.end();
