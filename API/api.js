//Configutacion e inclucion de librerias y archivos para la base de datos
//Declaracion para libreria express
const express = require("express");
const app = express();

//Declaracion para libreria Miscrosoft SQL
const sql = require("mssql");

//Declaracion para libreria dotenv
const dotenv = require("dotenv");
dotenv.config();

//Cargar la configuración de .env
const database = require("./config/database");

// Importar las consultas desde el archivo queries.js
const queries = require("./database/queries");

//Declaracion para el puerto
const port = process.env.PORT || 8080;

//Middleware para manejar errores de la base de datos
const handleDatabaseErrors = (err, req, res, next) => {
    console.log("Error en la base de datos:", err);
    res.status(500).send("Error en la base de datos: " + err.message);
};
//Middleware para manejar errores generales
const handleGeneralErrors = (err, req, res, next) => {
    console.log("Error:", err);
    res.status(500).send("Error general, favor de checar API: " + err.message);
};

//Configuración de los middleware
app.use(handleDatabaseErrors);
app.use(handleGeneralErrors);

//Conexión a la base de datos usando credenciales de database
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

//--------------------------Rutas------------------------

//Test GET
app.get("/api", function (req, res) {
    res.send("api works!");
});
//Consigue la lista de todos los alumnos
app.get("/api/getAllAlumni", async (req, res, next) => {
    try {
        const request = new sql.Request();
        const result = await request.query(queries.getAllAlumni);
        res.send(result.recordset);
    } catch (err) {
        next(err);
    }
});

//Consigue los datos necesarios para las credenciales
app.get("/api/getXCredentials", async (req, res, next) => {
    try {
        //Configuracion del request de sql
        const request = new sql.Request();
        //Establecemos rol
        var rol = "Alumno";
        //Creacion de query para busca a Alumno
        var search = queries.searchAlumni_o.replace(
            " remp_matricula ",
            req.query.mat_nom
        );
        var result = await request.query(search);
        //En dado caso de que falle, el codigo buscara si corresponde a una nomina, el cual
        //Buscara desde los privilegios mas altos hasta los mas bajos
        if (result.recordset.length === 0) {
            //Rangos declarados, primero los que tienen mayores accesos
            rangoArray = ["Director", "Administrador", "Instructor"];
            for (let i = 0; i < rangoArray.length; i++) {
                //Modifica el query base acorde a los roles
                search = queries.searchDirAdmIns.replace("remp_tabla", rangoArray[i]);
                search = search.replace(" remp_nomina ", req.query.mat_nom);
                result = await request.query(search);
                if (result.recordset.length === 1) {
                    rol = rangoArray[i];
                    result.recordset.push(rol);
                    if (!(result.recordset[0].contrasena === req.query.pswd)) {
                        result.recordset = null;
                    }
                    break;
                } else if (i === rangoArray.length - 1) {
                    result.recordset = null;
                }
            }
            res.send(result.recordset);
        } else if (!(result.recordset.length === 1)) {
            res.send(null);
        } else {
            result.recordset.push(rol);
            if (!(result.recordset[0].contrasena === req.query.pswd)) {
                result.recordset = null;
            }
            res.send(result.recordset);
        }
    } catch (err) {
        next(err);
    }
});

//----------------------------------------------------------------

//Iniciar el servidor
app.set("port", port);
app.listen(port, function () {
    console.log(`Servidor iniciado en el puerto ${port}`);
    console.log(database.config);
    connectToDatabase();
});
