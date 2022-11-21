require('dotenv-safe').config();

const {LOG_LEVEL, PORT} = process.env;

module.exports = {
  env: {
    dev: false,
  },
  log: {
    level: LOG_LEVEL || 'error',
  },
  server: {
    port: Number(PORT || 8080),
  },
};
