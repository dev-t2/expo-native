const sanitizeHtml = require('sanitize-html');

exports.contentsList = topics => {
  const list = topics.map(topic => {
    const sanitizedTitle = sanitizeHtml(topic.title);

    return `<li><a href="/?id=${topic.id}">${sanitizedTitle}</a></li>`;
  });

  return `<ul>${list.join('')}</ul>`;
};

exports.controlList = id => {
  if (id) {
    return `
      <div>
        <a href="/create">CREATE</a>
        <a href="/update?id=${id}">UPDATE</a>
      </div>

      <form method="POST" action="delete-process" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
        <input type="hidden" name="id" value="${id}"/>
        <button>DELETE</button>
      </form>
    `;
  }

  return `
    <div>
      <a href="/create">CREATE</a>
    </div>
  `;
};

exports.description = ({ title, description }) => {
  return `<h2>${title}</h2><p>${description}</p>`;
};

exports.form = ({
  path,
  id = 0,
  title = '',
  description = '',
  authors,
  authorId = 0,
}) => {
  const options = authors.map(author => {
    const sanitizedName = sanitizeHtml(author.name);

    if (author.id === authorId) {
      return `<option selected value="${author.id}">${sanitizedName}</option>`;
    }

    return `<option value="${author.id}">${sanitizedName}</option>`;
  });

  return `
    <form method="POST" action="${path}">
      <div>
        <input type="hidden" name="id" value="${id}"/>
      </div>

      <div>
        <input type="text" name="title" placeholder="Title" value="${title}"/>
      </div>

      <div>
        <textarea name="description" placeholder="Description">${description}</textarea>
      </div>

      <div>
        <select name="author">${options.join('')}</select>
      </div>

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  `;
};

exports.author = (authors, path, submit, id = 0, name = '', profile = '') => {
  const sanitizedName = sanitizeHtml(name);
  const sanitizedProfile = sanitizeHtml(profile);

  const list = authors.map(author => {
    const sanitizedName = sanitizeHtml(author.name);
    const sanitizedProfile = sanitizeHtml(author.profile);

    return `
      <li>
        <span>${sanitizedName}(<span>${sanitizedProfile}</span>)</span>
        <a href="/author/update?id=${author.id}">UPDATE</a>
        <form method="POST" action="/author/delete-process" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
          <input type="hidden" name="id" value="${author.id}"/>
          <button>DELETE</button>
        </form>
      </li>
    `;
  });

  return `
    <ul>
      ${list.join('')}
    </ul>

    <form method="POST" action="${path}">
      <div>
        <input type="hidden" name="id" value="${id}"/>
      </div>

      <div>
        <input type="text" name="name" placeholder="Name" value="${sanitizedName}" />
      </div>

      <div>
        <textarea name="profile" placeholder="Profile">${sanitizedProfile}</textarea>
      </div>

      <div>
        <button type="submit">${submit}</button>
      </div>
    </form>
  `;
};

exports.html = ({
  title,
  contentsList,
  controlList = '',
  contents,
  author = '',
}) => {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${title}</title>
      </head>

      <body>
        <h1>
          <a href="/">WEB</a>
        </h1>

        <div>
          <a href="/author">AUTHOR</a>
        </div>

        ${contentsList}
        ${controlList}
        ${contents}

        ${author && `<div>by ${author}</div>`}
      </body>
    </html>
  `;
};
