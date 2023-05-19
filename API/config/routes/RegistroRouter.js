const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

// Verificar si alumno ya entró
router.post("/api/verificarAlumnoLlegada", async (req, res, next)=>{
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

// Manda un registro a la base de datos
router.post("/api/marcarLlegada", async (req, res, next) => {
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

module.exports = router;