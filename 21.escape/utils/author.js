const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const database = require('./database');
const template = require('./template');

exports.home = res => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query('SELECT * FROM author', (error, authors) => {
      if (error) throw error;

      const title = 'Author';
      const path = '/author/create-process';
      const submit = 'CREATE';

      const contentsList = template.contentsList(topics);
      const contents = template.author(authors, path, submit);
      const html = template.html({
        title,
        contentsList,
        contents,
      });

      res.writeHead(200);
      res.end(html);
    });
  });
};

exports.update = (id, res) => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query('SELECT * FROM author', (error, authors) => {
      if (error) throw error;

      database.query(
        'SELECT * FROM author WHERE id = ?',
        [id],
        (error, [{ name, profile }]) => {
          if (error) throw error;

          const sanitizedName = sanitizeHtml(name);
          const sanitizedProfile = sanitizeHtml(profile);

          const title = 'Author';
          const path = '/author/update-process';
          const submit = 'UPDATE';

          const contentsList = template.contentsList(topics);
          const contents = template.author(
            authors,
            path,
            submit,
            id,
            sanitizedName,
            sanitizedProfile
          );
          const html = template.html({
            title,
            contentsList,
            contents,
          });

          res.writeHead(200);
          res.end(html);
        }
      );
    });
  });
};

exports.createProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { name, profile } = qs.parse(body);

    const sanitizedName = sanitizeHtml(name);
    const sanitizedProfile = sanitizeHtml(profile);

    database.query(
      `INSERT INTO author (name, profile) VALUES(?, ?)`,
      [sanitizedName, sanitizedProfile],
      error => {
        if (error) throw error;

        res.writeHead(302, { Location: `/author` });
        res.end();
      }
    );
  });
};

exports.updateProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { name, profile, id } = qs.parse(body);

    const sanitizedId = sanitizeHtml(id);
    const sanitizedName = sanitizeHtml(name);
    const sanitizedProfile = sanitizeHtml(profile);

    database.query(
      `UPDATE author SET name = ?, profile = ? WHERE id = ?`,
      [sanitizedName, sanitizedProfile, sanitizedId],
      error => {
        if (error) throw error;

        res.writeHead(302, { Location: `/author` });
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

    database.query('DELETE FROM topic WHERE author_id = ?', [id], error => {
      if (error) throw error;

      database.query(`DELETE FROM author WHERE id = ?`, [id], error => {
        if (error) throw error;

        res.writeHead(302, { Location: `/author` });
        res.end();
      });
    });
  });
};
