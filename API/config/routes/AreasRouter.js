const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

router.get("/api/AreaInformacion", async (req, res, next) => {
    const nombreArea = req.query.nombreArea;
    const request = new sql.Request();
    try {
        const result = await request
            .input('Nombre', sql.VarChar, nombreArea)
            .execute('AreaInformacion');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});


router.get("/api/TodasAreasInformacion", async (req, res, next) => {
    const request = new sql.Request();
    try {
        const result = await request.execute('TodasAreasInformacion');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});


module.exports = router;