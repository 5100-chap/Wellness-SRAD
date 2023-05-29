const { request } = require("express");
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");


// Obtener las reservas de un alumno
router.post('/api/getTodasReservasAlumno', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[GetTodasReservasAlumno] \'${req.body.usuario}\';`);
        res.json(result.recordset);
    }
    catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

// Obtener reservas de una semana
router.post('/api/getReservasSemanales',async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[ObtenerReservasSemanal] \'${req.body.lunes}\', \'${req.body.domingo}\', ${req.body.area_id};`);
        res.json(result.recordset);
    }
    catch(error){
        res.json({'status': error});
    }
});

// Para crear una reservación 
router.put('/api/createReservacionArea', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[CreateReservacionArea] \'${req.body.usuario}\', \'${req.body.fecha}\', \'${req.body.hora}\', \'${req.body.asesor}\', ${req.body.area_id}, \'Activa\';`);
        res.sendStatus(200);
    }
    catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

// Para crear una reservación (alt)
router.put('/api/altCreateReservacionArea', async(req, res, next)=>{
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

// Crear una reservación de un Locker
router.post('/api/createReservacionLocker', async(req, res, next)=>{
    try{
        var request = new sql.Request();       
        var result = await request.query(`EXEC [dbo].[CrearReservaCasillero] \'${req.body.matricula}\', ${req.body.id_casillero};`);
    }catch(error){
        console.log(error);
        res.json({'status': 'error'});
    }
});

// Actualizar el estatus de un locker 
router.post('/api/actualizarEstadoLocker', async(req, res, next)=>{
    try{
        var request = new sql.Request();       
        var result = await request.query(`EXEC [dbo].[ActualizarEstadoCasillero] \ ${req.body.id_casillero};`);
    }catch(error){
        console.log(error);
        res.json({'status': 'error'});
    }
});

//Revisar si el alumno tiene una reserva de casillero, si la tiene que la obtenga

router.post("/api/consultarReservaCasillero", async (req, res, next) => {
    try {
        if (req.body === undefined) {
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = `EXEC [dbo].[ExisteReservaCasillero] \'${req.body.matricula}\';`;

        var result = await request.query(search);
        res.send(result.recordset[0]);
    }
    catch (err) {
        next(err);
    }
    

});


// Cancelar una reservación
router.delete('/api/cancelReservacionArea', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[CancelReservacionArea] \'${req.body.usuario}\', ${req.body.id};`);
        res.json({'status': 'ok'});
    }
    catch(error){
        console.log(error);
        res.json({'status': 'failed'});
    }
});

// Reserva en curso
router.put('/api/reservaEnCurso', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[ReservaEnCurso] ${req.body.id};`);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

//Montitor de Ingresos
router.get('/api/getDataMonitorIngresos',async(req,res,next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[GetDataMonitorIngresos];`);
        res.json(result.recordset)
    }catch(error){
        console.log(error);
        res.sendStatus(404);
    }
})
// Marcar Entrada desde una reserva
router.post('/api/marcarLlegadaReserva', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        const currentTime = new Date();
        var dia = `${currentTime.getFullYear()}-${currentTime.getMonth()+1}-${currentTime.getDate()}`;
        var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;        
        var result = await request.query(`EXEC [dbo].[MarcarLlegadaReserva] \'${req.body.usuario}\', \'${hora}\', \'${dia}\', ${req.body.area_id}, ${req.body.id_reservacion};`);
    }catch(error){
        console.log(error);
        res.json({'status': 'error'});
    }
});

// Marcar Salida desde una reserva
router.post('/api/marcarSalidaReserva', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        const currentTime = new Date();
        var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;        
        await request.query(`EXEC [dbo].[MarcarSalida] \'${hora}\', \'${req.body.usuario}\';EXEC [dbo].[MarcarSalidaReserva] ${req.body.id};`);
    }catch(error){
        console.log(error);
        res.json({'status': 'error'});
    }
});

// Mostrar lista de asesores por rol
router.post('/api/getAsesoresPorRol', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        const result = request.query(`EXEC [dbo].[GetAsesoresPorRol] '${req.body.rol}';`);
        res.json((await result).recordset);
    }
    catch(error){
        console.log(error);
        res.sendStatus(404);
    }
});

module.exports = router;