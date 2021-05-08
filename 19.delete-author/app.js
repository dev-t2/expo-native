const dotenv = require('dotenv');
const http = require('http');

const author = require('./utils/author');
const topic = require('./utils/topic');

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const app = http.createServer((req, res) => {
  const url = new URL(req.url, BASE_URL);
  const pathName = url.pathname;
  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET') {
      if (pathName === '/') {
        if (id) {
          topic.page(id, res);
        } else {
          topic.home(res);
        }
      } else if (pathName === '/create') {
        topic.create(res);
      } else if (pathName === '/update') {
        topic.update(id, res);
      } else if (pathName === '/author') {
        author.home(res);
      } else if (pathName === '/author/update') {
        author.update(id, res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    }

    if (req.method === 'POST') {
      if (pathName === '/create-process') {
        topic.createProcess(req, res);
      }

      if (pathName === '/update-process') {
        topic.updateProcess(req, res);
      }

      if (pathName === '/delete-process') {
        topic.deleteProcess(req, res);
      }

      if (pathName === '/author/create-process') {
        author.createProcess(req, res);
      }

      if (pathName === '/author/update-process') {
        author.updateProcess(req, res);
      }

      if (pathName === '/author/delete-process') {
        author.deleteProcess(req, res);
      }
    }
  } catch (error) {
    console.error(error);

    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`${BASE_URL} 에서 서버 실행 중...`);
});
