const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");


// Obtener las reservas de un alumno
router.get('/api/getTodasReservasAlumno', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[GetTodasReservasAlumno] \'${req.body.usuario}\';`);
        console.log(result.recordset);
        res.json(result.recordset);
    }
    catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

// Para crear una reservación 
router.put('/api/createReservacionArea', async(req, res, next)=>{
    var currentTime = new Date();
    var dia = `${currentTime.getFullYear()}-${currentTime.getMonth()+1}-${currentTime.getDate()}`;
    var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[CreateReservacionArea] \'${req.body.usuario}\', \'${dia}\', \'${hora}\', \'${req.body.asesor}\', ${req.body.area_id}, \'Activa\';`);
        res.sendStatus(200);
    }
    catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

module.exports = router;