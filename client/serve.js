const fs = require('fs');
const path = require('path');

const compression = require('compression');
const express = require('express');

const PORT = Number(process.env.PORT || 3000);

const STATIC_DIR = path.resolve(__dirname, 'build');

const app = express();

app.use(compression());

const getFiles = dir => {
  const files = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
};

const pages = getFiles(STATIC_DIR)
  .filter(file => file.endsWith('.html'))
  .map(file => path.relative(STATIC_DIR, file));

pages.forEach(page => {
  const filename = page.substr(0, page.lastIndexOf('.'));
  const endpoint =
    '/' + (filename === 'index' ? '' : filename.replace(/\[(.*)\]/, ':$1'));

  app.get(endpoint, (req, res) => {
    res.sendFile(path.join(STATIC_DIR, page));
  });
});

app.use(express.static(STATIC_DIR));

app.use((req, res) => {
  res.sendFile(path.join(STATIC_DIR, '404.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
