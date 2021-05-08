const qs = require('querystring');

const database = require('./database');
const template = require('./template');

exports.home = res => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query('SELECT * FROM author', (error, authors) => {
      if (error) throw error;

      const title = 'Author';

      const contentsList = template.contentsList(topics);
      const contents = template.author(authors);
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

exports.createProcess = (req, res) => {
  let body = '';

  req.on('data', data => {
    body += data;
  });

  req.on('end', () => {
    const { name, profile } = qs.parse(body);

    database.query(
      `INSERT INTO author (name, profile) VALUES(?, ?)`,
      [name, profile],
      error => {
        if (error) throw error;

        res.writeHead(302, { Location: `/author` });
        res.end();
      }
    );
  });
};
