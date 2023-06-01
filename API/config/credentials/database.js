//const sql = require('mssql');
require('dotenv').config();

//Credenciales extraidas del archivo .env utilizadas en Azure
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options : {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  }
};


module.exports = {
  config,
};
