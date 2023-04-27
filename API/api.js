//Configutacion e inclucion de librerias y archivos para la base de datos
//Declaracion para libreria express
const express = require('express');
const app = express();

//Declaracion para libreria Miscrosoft SQL
const sql = require('mssql');

//Declaracion para libreria dotenv
const dotenv = require('dotenv');
dotenv.config();

//Cargar la configuración de .env
const database = require('./config/database');

// Importar las consultas desde el archivo queries.js
const queries = require('./queries');

//Declaracion para el puerto
const port = (process.env.PORT || 8080)


//Middleware para manejar errores de la base de datos
const handleDatabaseErrors = (err, req, res, next) => {
    console.log('Error en la base de datos:', err);
    res.status(500).send('Error en la base de datos: ' + err.message);
};
//Middleware para manejar errores generales
const handleGeneralErrors = (err, req, res, next) => {
    console.log('Error:', err);
    res.status(500).send('Error general, favor de checar API: ' + err.message);
};

//Configuración de los middleware
app.use(handleDatabaseErrors);
app.use(handleGeneralErrors);

//Conexión a la base de datos usando credenciales de database
const connectToDatabase = async () => {
    try {
        await sql.connect(database.config);
        console.log('Conectado a la base de datos');
    } catch (err) {
        console.log('Error al conectar a la base de datos:' + err.message + '\n', err);
    }
};

app.get('/api', function (req, res) {
    res.send('api works!')
})

app.get('/api/getAllAlumni', async (req, res, next) => {
    try {
        const request = new sql.Request();
        const result = await request.query(queries.getAllAlumni);
        res.send(result.recordset);
    } catch (err) {
        next(err);
    }
});

//Iniciar el servidor
app.set('port', port);
app.listen(port, function () {
    console.log(`Servidor iniciado en el puerto ${port}`);
    console.log(database.config);
    connectToDatabase();
});
