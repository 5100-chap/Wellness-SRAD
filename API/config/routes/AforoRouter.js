const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

//Consigue el número de casilleros disponibles
router.get("/api/getDisponibilidadCasilleros", async (req, res, next) => {
    const request = new sql.Request();
    try {
        const result = await request.execute("GetDisponibilidadCasilleros");
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

// Estadisticas
router.get("/api/llamarAforo", async (req, res, next) => {
    try {
        var request = new sql.Request();
        // var search = queries.llamarTodoElAforo.replace('@matricula_alumno', req.body.usuario);
        var result = await request.query("EXEC [dbo].[LlamarTodoElAforo];");
        res.send(result.recordset);
    } catch (err) {
        next(err);
    }
});


// Consultar el aforo de un área deportiva
router.post("/api/consultarAforo", async (req, res, next) => {
    try {
        if (req.body === undefined) {
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = `EXEC [dbo].[ConsultarAforoActualYTotal] ${req.body.area_id};`;

        // var search = queries.consultarAforoActualYTotal.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(result.recordset[0]);
    } catch (err) {
        next(err);
    }
});

// Aumentar el aforo
router.post("/api/aumentarAforo", async (req, res, next) => {
    try {
        if (req.body === undefined) {
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var search = `EXEC [dbo].[AumentoAforo] ${req.body.area_id}`;

        // var search = queries.aumentoAforo.replace('@area_id', req.body.area_id);
        // search = search.replace('@area_id', req.body.area_id);
        var result = await request.query(search);
        res.send(200);
    } catch (err) {
        next(err);
    }
});

// Disminuir el aforo
router.post("/api/disminuirAforo", async (req, res, next) => {
    try {
        if (req.body === undefined) {
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
    } catch (err) {
        next(err);
    }
});

router.get("/api/AforoSemanal", async (req, res, next) => {
    const date = req.query.date;
    const areaId = req.query.areaId;
    const request = new sql.Request();
    try {
        const result = await request
            .input("Date", sql.Date, date)
            .input("AreaId", sql.Int, areaId)
            .execute("AforoSemanal");
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

router.get("/api/ingresosPorHora/", async (req, res, next) => {
    const AreaId = req.query.AreaId;
    const Day = req.query.Day;
    const request = new sql.Request();
    try {
        const result = await request
            .input("AreaId", sql.Int, AreaId)
            .input("Day", sql.Date, Day)
            .execute("GetIngresosPorHora");
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

// Modificar el aforo máximo
router.post("/api/modificarAforoMaximo", async (req, res, next) => {
    try {
        if (req.body === undefined) {
            res.send(404);
            return;
        }
        var request = new sql.Request();
        var fechaActual = new Date(); // Se obtiene la fecha y hora actual
        var result = await request
            .input("area_id", sql.Int, req.body.area_id)
            .input("nuevo_limite", sql.Int, req.body.nuevo_limite)
            .input("esIndefinido", sql.Bit, req.body.esIndefinido)
            .input("fechaInicio", sql.DateTime, req.body.fechaInicio || null)
            .input("fechaFinal", sql.DateTime, req.body.fechaFinal || null)
            .input("descripcion", sql.VarChar(200), req.body.descripcion || null)
            .input("fechaActual", sql.DateTime, fechaActual)
            .execute("[dbo].[ModificarAforoMaximo]");
            res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
