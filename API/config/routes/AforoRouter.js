const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

// Estadisticas
router.get("/api/llamarAforo", async (req, res, next) => {
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


router.post("/api/consultarAforo", async (req, res, next) => {
    try{
        if(req.body === undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = `EXEC [dbo].[ConsultarAforoActualYTotal] ${req.body.area_id}`;

        // var search = queries.consultarAforoActualYTotal.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(result.recordset[0]);
    }
    catch(err){
        next(err);
    }
});

// Aumentar el aforo
router.post("/api/aumentarAforo", async (req, res, next) => {
    try{
        if(req.body===undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = `EXEC [dbo].[AumentoAforo] ${req.body.area_id}`;

        // var search = queries.aumentoAforo.replace('@area_id', req.body.area_id);
        // search = search.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(200);
    }
    catch(err){
        next(err);
    }
});

// Disminuir el aforo
router.post("/api/disminuirAforo", async (req, res, next) => {
    try{
        if(req.body===undefined){
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var newSearch = `EXEC [dbo].[disminuirAforo] ${req.body.area_id}`;
        var result = await request.query(newSearch);

        // var search = queries.disminuirAforo.replace('@area_id', req.body.area_id);
        // search = search.replace('@area_id', req.body.area_id);
        // var result = await request.query(search);
        res.send(200);
    }
    catch(err){
        next(err);
    }
});

router.get("/api/AforoSemanal", async (req, res, next) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const request = new sql.Request();
    try {
        const result = await request
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .execute('AforoSemanal');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

module.exports = router;