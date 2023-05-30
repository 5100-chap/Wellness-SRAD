const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");
const { async } = require("rxjs");

//Consigue la lista de todos los casilleros disponibles
router.get("/api/getAnuncios", async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('GetAnuncios');
        res.json(result.recordset);

    } catch (err){
        next(err);
    }

});

//Consigue insertar un nuevo registro de anuncio (PENDIENTE!!!)
router.put("/api/CrearAnuncio", async (req,res,next) => {
    const request = new sql.Request();
    try{
        const result = await request.query(`EXEC [dbo].[CrearAnuncio] \'${req.body.fecha_inicio_evento}\', \'${req.body.fecha_fin_evento}\',\'${req.body.ubicacion}\',\'${req.body.descripcion}\',\'${req.body.duracion_inicio}\', \'${req.body.duracion_fin}\', \'${req.body.imagen}\', \'${req.body.titulo}\';`);
        res.sendStatus(200);
    } catch(err){
        next(err)
    }
});

module.exports = router;
