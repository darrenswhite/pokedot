require('dotenv-safe').config();

const {PORT} = process.env;

module.exports = {
  env: {
    dev: true,
  },
  log: {
    level: 'error',
  },
  server: {
    port: Number(PORT || 8080),
  },
};
