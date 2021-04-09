const path = require('path');

const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const PORT = Number(process.env.PORT || 3000);

const STATIC_DIR = path.resolve(__dirname, 'out');

const app = express();

app.use(
  expressStaticGzip(STATIC_DIR, {
    enableBrotli: true,
  })
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
