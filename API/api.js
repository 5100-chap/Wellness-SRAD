//Configutacion e inclucion de librerias y archivos para la base de datos
//Declaracion para libreria express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

//Declaracion para libreria Miscrosoft SQL
const sql = require("mssql");

//Declaracion para libreria dotenv
const dotenv = require("dotenv");
dotenv.config();

//Cargar la configuración de .env
const database = require("./config/database");

// Importar las consultas desde el archivo queries.js
const queries = require("./database/queries");
const { async } = require("rxjs");

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

// Estadisticas
app.get("/api/llamarAforo", async (req, res, next) => {
    try{
        var request = new sql.Request();
        var search = queries.llamarTodoElAforo.replace('@matricula_alumno', req.body.usuario);
        var result = await request.query(search);
        res.send(result.recordset[0][""]);
    }
    catch(err){
        next(err);
    }
});

// Verificar si alumno ya entró
app.post("/api/verificarAlumnoLlegada", async (req, res, next)=>{
    try{
        if(req.body===undefined){
            res.send("Failure");
            return;
        }
        var request = new sql.Request();
        var search = queries.verificarRegistro.replace('@matricula_alumno', req.body.usuario);
        var result = await request.query(search);
        if(!result.recordset[0][""]){
            res.send({'status':0});
        }
        else{
            res.send({'status':1});
        }
    }
    catch(err){
        next(err);
    }
});

app.post("/api/consultarAforo", async (req, res, next) => {
    try{
        if(req.body === undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = queries.consultarAforoActualYTotal.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(result.recordset[0]);
    }
    catch(err){
        next(err);
    }
});

// Aumentar el aforo
app.post("/api/aumentarAforo", async (req, res, next) => {
    try{
        if(req.body===undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = queries.aumentoAforo.replace('@area_id', req.body.area_id);
        search = search.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(200);
    }
    catch(err){
        next(err);
    }
});

// Disminuir el aforo
app.post("/api/disminuirAforo", async (req, res, next) => {
    try{
        if(req.body===undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = queries.disminuirAforo.replace('@area_id', req.body.area_id);
        search = search.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(200);
    }
    catch(err){
        next(err);
    }
});

// Manda un registro a la base de datos
app.post("/api/marcarLlegada", async (req, res, next) => {
    try{
        if(req.body===undefined){
            console.log('Cuerpo vacio');
            res.send("Failure");
            return;
        }
        var currentTime = new Date();
        var request = new sql.Request();
        var fecha = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
        var hora = currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
        var search = queries.verificarRegistro.replace('@matricula_alumno', req.body.usuario);
        var result = await request.query(search);
        if(!result.recordset[0][""]){
            console.log("No ha entrado, entonces entra");
            search = queries.insertarRegistro.replace('@matricula_alumno', req.body.usuario);
            search = search.replace('@hora_de_llegada', hora);
            search = search.replace('@fecha', fecha);
            search = search.replace('@id_area', req.body.area_id);
            request.query(search);
        }
        else{
            console.log("ya había entrado, entonces sale");
            currentTime = new Date();
            hora = currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
            search = queries.marcarSalida.replace('@salida', hora);
            search = search.replace('@matricula_alumno', req.body.usuario);
            request.query(search);
        }
        res.send();
    }
    catch(err){
        next(err);
    }
});

//Consigue los datos necesarios para las credenciales
app.get("/api/getXCredentials", async (req, res, next) => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;
        
        // Check if the header is present and contains Basic authentication
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.status(401).send('Unauthorized');
            return;
        }
        
        // Decode the base64-encoded credentials
        const encodedCredentials = authHeader.slice('Basic '.length);
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
        
        // Parse the credentials into username and password
        const [username, password] = decodedCredentials.split(':');
        
        // Configuracion del request de sql
        const request = new sql.Request();
        // Creacion de variables de query para buscar
        var search;
        var result;
        // El codigo buscara si corresponde a una nomina o matricula, el cual
        // Buscara primero al alumno y despues dentro de los roles que contienen nomina
        rangoArray = ["Alumno", "Director", "Administrador", "Instructor"];
        for (let i = 0; i < rangoArray.length; i++) {
            // Modifica el query base acorde a los roles
            search = queries.searchDirAdmInsAl.replace("remp_tabla", rangoArray[i]);
            if (rangoArray[i] === "Alumno") {
                search = search.replace("numero_nomina", "matricula");
            }
            search = search.replace(" remp_nomina ", username);
            result = await request.query(search);
            if (result.recordset.length === 1) {
                result.recordset.push(rangoArray[i]);
                if (!(result.recordset[0].contrasena === password)) {
                    console.log("Triggered password error");
                    result.recordset = null;
                    res.status(401).send('Unauthorized');
                    return;
                }
                break;
            } else if (i === rangoArray.length - 1) {
                console.log("Triggered illegal instruction");
                result.recordset = null;
                res.status(401).send('Unauthorized');
                return;
            }
        
        }
        console.log(username);
        res.send(result.recordset);
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
