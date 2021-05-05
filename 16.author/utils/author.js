const database = require('./database');
const template = require('./template');

exports.home = res => {
  database.query('SELECT * FROM topic', (error, topics) => {
    if (error) throw error;

    database.query('SELECT * FROM author', (error, authors) => {
      if (error) throw error;

      const title = 'Author';

      const contentsList = template.contentsList(topics);
      const controlList = template.controlList();
      const contents = template.authorList(authors);
      const html = template.html({
        title,
        contentsList,
        controlList,
        contents,
      });

      res.writeHead(200);
      res.end(html);
    });
  });
};
