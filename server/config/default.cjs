require('dotenv-safe').config();

const {LOG_LEVEL, PORT} = process.env;

module.exports = {
  env: {
    dev: true,
  },
  log: {
    level: LOG_LEVEL || 'debug',
  },
  server: {
    port: Number(PORT || 8080),
  },
};
