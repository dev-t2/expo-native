const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const qs = require('querystring');
const mysql = require('mysql');

const template = require('./utils/template');

dotenv.config();

const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const DATA_PATH = path.join(__dirname, 'data');

const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: DATABASE,
  password: PASSWORD,
});

database.connect();

const app = http.createServer(async (req, res) => {
  const url = new URL(req.url, BASE_URL);
  const pathName = url.pathname;

  try {
    if (req.method === 'GET') {
      if (pathName === '/') {
        database.query('SELECT * FROM topic', (error, topics) => {
          if (error) throw error;

          const id = url.searchParams.get('id');

          if (id) {
            database.query(
              'SELECT * FROM topic WHERE id=?',
              [id],
              (error, [{ title, description }]) => {
                if (error) throw error;

                const contentsList = template.contentsList(topics);
                const controlList = template.controlList(id);
                const contents = template.description({ title, description });
                const html = template.html({
                  title,
                  contentsList,
                  controlList,
                  contents,
                });

                res.writeHead(200);
                res.end(html);
              }
            );
          } else {
            const title = 'Welcome';
            const description = 'Hello, Node.js';

            const contentsList = template.contentsList(topics);
            const controlList = template.controlList();
            const contents = template.description({ title, description });
            const html = template.html({
              title,
              contentsList,
              controlList,
              contents,
            });

            res.writeHead(200);
            res.end(html);
          }
        });
      } else if (pathName === '/create') {
        database.query('SELECT * FROM topic', (error, topics) => {
          if (error) throw error;

          const title = 'WEB - Create';
          const contentsList = template.contentsList(topics);
          const contents = template.form({ path: '/create-process' });
          const html = template.html({ title, contentsList, contents });

          res.writeHead(200);
          res.end(html);
        });
      } else if (pathName === '/update') {
        database.query('SELECT * FROM topic', (error, topics) => {
          if (error) throw error;

          const id = url.searchParams.get('id');

          if (id) {
            database.query(
              'SELECT * FROM topic WHERE id=?',
              [id],
              (error, [{ title, description }]) => {
                if (error) throw error;

                const contentsList = template.contentsList(topics);
                const contents = template.form({
                  path: '/update-process',
                  id,
                  title,
                  description,
                });
                const html = template.html({ title, contentsList, contents });

                res.writeHead(200);
                res.end(html);
              }
            );
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    } else if (req.method === 'POST') {
      if (pathName === '/create-process') {
        let body = '';

        req.on('data', data => {
          body += data;
        });

        req.on('end', () => {
          const { title, description } = qs.parse(body);

          database.query(
            `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [title, description, 1],
            (error, results) => {
              if (error) throw error;

              res.writeHead(302, { Location: `/?id=${results.insertId}` });
              res.end();
            }
          );
        });
      } else if (pathName === '/update-process') {
        let body = '';

        req.on('data', data => {
          body += data;
        });

        req.on('end', async () => {
          const { id, title, description } = qs.parse(body);

          database.query(
            `UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
            [title, description, id],
            error => {
              if (error) throw error;

              res.writeHead(302, { Location: `/?id=${id}` });
              res.end();
            }
          );
        });
      } else if (pathName === '/delete-process') {
        let body = '';

        req.on('data', data => {
          body += data;
        });

        req.on('end', async () => {
          const { id } = qs.parse(body);
          const filteredId = path.parse(id).base;

          const filePath = path.join(DATA_PATH, `${filteredId}.txt`);

          await fs.unlink(filePath);

          res.writeHead(302, { Location: `/` });
          res.end();
        });
      }
    }
  } catch (error) {
    console.error(error);

    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

app.listen(PORT);
