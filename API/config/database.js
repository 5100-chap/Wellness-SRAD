//const sql = require('mssql');
require('dotenv').config();

//Credenciales extraidas del archivo .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options : {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  }
};

module.exports = {
  config, //Esta linea devuelve las credenciales
  //Deprecated: Esta funcion es para conectarse directamente a la base de datos
  /*
  connect: function () {
    return sql.connect(config);
  }
  */
};
