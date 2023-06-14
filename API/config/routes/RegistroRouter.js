const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

const { verifyJWT } = require("../middleware/jwtSecurity");

// Verificar si alumno ya entró
router.post("/api/verificarAlumnoLlegada", verifyJWT, async (req, res, next)=>{
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
router.post("/api/marcarLlegada", verifyJWT, async (req, res, next) => {
    try{
        if(req.body===undefined){
            res.send("Failure");
            return;
        }
        var currentTime = new Date();
        var request = new sql.Request();
        var fecha = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
        var hora = currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
        var result = await request.query(`EXEC [dbo].[VerificarRegistro] \'${req.body.usuario}\'`);
        if(!result.recordset[0][""]){
            request.query(`EXEC [dbo].[InsertarRegistro] \'${req.body.usuario}\', \'${hora}\', \'${fecha}\', ${req.body.area_id};`);
        }
        else{
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
router.post('/api/marcarLlegadaAsesor', verifyJWT, async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[MarcarLlegadaAsesor] '${req.body.hora}', ${req.body.id};`);
        res.json();
    }
    catch(error){
        res.send(error);
    }
});

//Saber si existe un alumno en la base de datos
router.post('/api/existeAlumno', verifyJWT, async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[existeAlumno] '${req.body.matricula}';`);
        res.json(result.recordset);
    }
    catch(error){
        res.send(error);
    }
});


//Marcar la llegada de un alumno al gimansio de forma manual
router.post('/api/marcarLlegadaAlumnoManual', verifyJWT, async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[marcarEntredaAlumnoManual] '${req.body.matricula}', '${req.body.dia}', '${req.body.hora}';`);
        res.json(result.recordset);
    }
    catch(error){
        res.send(error);
    }
});



// Marcar Salida de un alumno con su asesor
router.post('/api/marcarSalidaAsesor', verifyJWT, async(req, res, next)=>{
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
router.post('/api/cancelarReservaAsesor', verifyJWT, async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[CancelarReservaAsesor] ${req.body.id};`);
    }
    catch(error){
        res.json(error);
    }
});

module.exports = router;