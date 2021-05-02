const qs = require('querystring');

const database = require('./database');
const template = require('./template');

exports.home = res => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

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
  });
};

exports.page = (id, res) => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query(
      'SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?',
      [id],
      (error, [{ title, description, name }]) => {
        if (error) throw error;

        const contentsList = template.contentsList(topics);
        const controlList = template.controlList(id);
        const contents = template.description({ title, description });
        const html = template.html({
          title,
          contentsList,
          controlList,
          contents,
          author: name,
        });

        res.writeHead(200);
        res.end(html);
      }
    );
  });
};

exports.create = res => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query('SELECT * FROM author', (error, authors) => {
      if (error) throw error;

      const contentsList = template.contentsList(topics);
      const contents = template.form({
        path: '/create-process',
        authors,
      });
      const html = template.html({
        title: 'Web - Create',
        contentsList,
        contents,
      });

      res.writeHead(200);
      res.end(html);
    });
  });
};

exports.createProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { title, description, author } = qs.parse(body);

    database.query(
      `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
      [title, description, author],
      (error, results) => {
        if (error) throw error;

        res.writeHead(302, { Location: `/?id=${results.insertId}` });
        res.end();
      }
    );
  });
};

exports.update = (id, res) => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    if (id) {
      database.query(
        'SELECT * FROM topic WHERE id=?',
        [id],
        (error, [{ title, description, author_id }]) => {
          if (error) throw error;

          database.query('SELECT * FROM author', (error, authors) => {
            if (error) throw error;

            const contentsList = template.contentsList(topics);
            const contents = template.form({
              path: '/update-process',
              id,
              title,
              description,
              authors,
              authorId: author_id,
            });
            const html = template.html({
              title: 'Web - Update',
              contentsList,
              contents,
            });

            res.writeHead(200);
            res.end(html);
          });
        }
      );
    }
  });
};

exports.updateProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { id, title, description, author } = qs.parse(body);

    database.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [title, description, author, id],
      error => {
        if (error) throw error;

        res.writeHead(302, { Location: `/?id=${id}` });
        res.end();
      }
    );
  });
};

exports.deleteProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { id } = qs.parse(body);

    database.query(`DELETE FROM topic WHERE id=?`, [id], error => {
      if (error) throw error;

      res.writeHead(302, { Location: `/` });
      res.end();
    });
  });
};
