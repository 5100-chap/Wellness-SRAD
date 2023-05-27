//Configutacion e inclucion de librerias y archivos para la base de datos
//Declaracion para libreria express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sql = require("mssql");
const cancel = require('./config/middleware/cancelacionAutomatica');

//Cargar la configuración de .env
dotenv.config();

const database = require("./config/credentials/database");

const routes = require("./config/routes/router"); // Import the combined routes
const cancelAuto = require("./config/middleware/cancelacionAutomatica");

const port = process.env.PORT || 8080;

const handleDatabaseErrors = (err, req, res, next) => {
    console.log("Error en la base de datos:", err);
    res.status(500).send("Error en la base de datos: " + err.message);
};

const handleGeneralErrors = (err, req, res, next) => {
    console.log("Error:", err);
    res.status(500).send("Error general, favor de checar API: " + err.message);
};

//Usar errores declarados previamente
app.use(handleDatabaseErrors);
app.use(handleGeneralErrors);
//Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Usar las rutas
app.use(routes); 

//Funcion para iniciar el servidor
const connectToDatabase = async () => {
    try {
        await sql.connect(database.config);
        console.log("Conectado a la base de datos");
    } catch (err) {
        console.log(
            "Error al conectar a la base de datos:" + err.message + "\n",
            err
        );
    }
};

//Iniciar el servidor
app.set("port", port);
app.listen(port, function () {
    console.log(`Servidor iniciado en el puerto ${port}`);
    console.log(database.config);
    (async () => {
        await connectToDatabase();
        cancelAuto();
        setInterval(cancelAuto, 5*60*1000);
    })();
});
