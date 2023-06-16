//Configutacion e inclucion de librerias y archivos para la base de datos
//Declaracion para libreria express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sql = require("mssql");

//Cargar la configuración de .env
dotenv.config();

const database = require("./config/credentials/database");

const routes = require("./config/routes/router"); 
const cancelAuto = require("./config/routines/cancelacionAutomatica");
const cancelReservaAsesorAuto = require("./config/routines/cancelarReservasAsesor");
const AforoTotalAutomatico = require("./config/routines/AforoTotalAutomatico");
const AbrirCerrarAreas = require("./config/routines/AbrirCerrarAreas");
const eliminarAnuncios = require("./config/routines/EliminarAnuncio")

const port = process.env.PORT || 8080;

const handleDatabaseErrors = (err, req, res, next) => {
    res.status(500).send("Error en la base de datos: " + err.message);
};

const handleGeneralErrors = (err, req, res, next) => {
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
    } catch (err) {
        console.error(
            "Error al conectar a la base de datos:" + "\n",
            err
        );
    }
};

// Use the /dist directory
app.use(express.static(__dirname + '/dist/wellness-srad'));

// Catch all other invalid routes
app.all('*', function(req,res){
    res.status(200).sendFile(__dirname + '/dist/wellness-srad/index.html');
});


//Iniciar el servidor
app.set("port", port);
app.listen(port, function () {
    (async () => {
        await connectToDatabase();
        cancelAuto();
        cancelReservaAsesorAuto();
        AbrirCerrarAreas();
        AforoTotalAutomatico();
        eliminarAnuncios();
        setInterval(cancelAuto, 5*60*1000);
        setInterval(cancelReservaAsesorAuto, 5*60*1000);
    })();
});
