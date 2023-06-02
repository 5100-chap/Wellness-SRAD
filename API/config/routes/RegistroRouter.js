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
        var result = await request.query(`EXEC [dbo].[VerificarRegistro] ${req.body.usuario};`);
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
        var result = await request.query(`EXEC [dbo].[VerificarRegistro] \'${req.body.usuario}\'`);
        if(!result.recordset[0][""]){
            console.log("No ha entrado, entonces entra");
            request.query(`EXEC [dbo].[InsertarRegistro] \'${req.body.usuario}\', \'${hora}\', \'${fecha}\', ${req.body.area_id};`);
        }
        else{
            console.log("ya había entrado, entonces sale");
            currentTime = new Date();
            hora = currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
            request.query(`EXEC [dbo].[MarcarSalida] \'${hora}\', \'${req.body.usuario}\';`);
        }
        res.send(200);
    }
    catch(err){
        next(err);
    }
});

// Marcar llegada de un alumno pero con su asesor
router.post('/api/marcarLlegadaAsesor', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[MarcarLlegadaAsesor] '${req.body.hora}', ${req.body.id};`);
        res.json();
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
});

// Marcar Salida de un alumno con su asesor
router.post('/api/marcarSalidaAsesor', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[MarcarSalidaAsesor] '${req.body.hora}', ${req.body.id};`);
        res.json();
    }
    catch(error){
        res.json(error);
    }
});

// Cancelar Reserva Con Asesor
router.post('/api/cancelarReservaAsesor', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[CancelarReservaAsesor] ${req.body.id};`);
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router;