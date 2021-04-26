const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
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

                const controls = ['create', 'update', 'delete'];

                const list = template.list({ topics });
                const contents = template.description({ title, description });
                const html = template.html({ title, list, controls, contents });

                res.writeHead(200);
                res.end(html);
              }
            );
          } else {
            const title = 'Welcome';
            const description = 'Hello, Node.js';
            const controls = ['create'];

            const list = template.list({ topics });
            const contents = template.description({ title, description });
            const html = template.html({ title, list, controls, contents });

            res.writeHead(200);
            res.end(html);
          }
        });
      } else if (pathName === '/create') {
        const title = 'WEB - Create';
        const contents = template.form({ path: '/create-process' });
        const html = template.html({ title, contents });

        res.writeHead(200);
        res.end(html);
      } else if (pathName === '/update') {
        const title = url.searchParams.get('id');
        const filteredTitle = path.parse(title).base;

        const filePath = path.join(DATA_PATH, `${filteredTitle}.txt`);
        const description = await fs.readFile(filePath, { encoding: 'utf-8' });

        const contents = template.form({
          path: '/update-process',
          title,
          description,
        });
        const html = template.html({ title, contents });

        res.writeHead(200);
        res.end(html);
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

        req.on('end', async () => {
          const { title, description } = qs.parse(body);
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(description);

          const filePath = path.join(DATA_PATH, `${sanitizedTitle}.txt`);

          await fs.writeFile(filePath, sanitizedDescription, {
            encoding: 'utf-8',
          });

          res.writeHead(302, { Location: `/?id=${sanitizedTitle}` });
          res.end();
        });
      } else if (pathName === '/update-process') {
        let body = '';

        req.on('data', data => {
          body += data;
        });

        req.on('end', async () => {
          const { id, title, description } = qs.parse(body);
          const sanitizedId = sanitizeHtml(id);
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(description);

          const oldPath = path.join(DATA_PATH, `${sanitizedId}.txt`);
          const newPath = path.join(DATA_PATH, `${sanitizedTitle}.txt`);

          await fs.rename(oldPath, newPath);
          await fs.writeFile(newPath, sanitizedDescription, {
            encoding: 'utf-8',
          });

          res.writeHead(302, { Location: `/?id=${sanitizedTitle}` });
          res.end();
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
