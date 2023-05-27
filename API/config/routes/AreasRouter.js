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

//Consigue la lista de todos los casilleros disponibles
router.get("/api/getCasillerosDisponibles", async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('getCasillerosDisponibles');
        res.json(result.recordset);

    } catch (err){
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

router.put("/api/AreaUpdateStatus", async (req, res, next) => {
    const areaId = req.query.areaId;
    const request = new sql.Request();
    try {
        const result = await request
            .input('AreaId', sql.Int, areaId)
            .execute('AbrirArea');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});


module.exports = router;