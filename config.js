module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    DB_URI: process.env.DB_URI || 'localhost',
    DB_USER: process.env.DB_USER || '',
    DB_PASS: process.env.DB_PASS || '',
    DB: process.env.DB || 'final_test',
    DB_TYPE: process.env.DB_TYPE || 'mysql'
  };