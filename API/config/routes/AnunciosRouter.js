const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");
const { async } = require("rxjs");

const { verifyJWT } = require("../middleware/jwtSecurity");

//Consigue la lista de todos los casilleros disponibles
router.get("/api/getAnuncios", verifyJWT, async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('GetAnuncios');
        res.json(result.recordset);

    } catch (err){
        next(err);
    }
});

//Consigue insertar un nuevo registro de anuncio (PENDIENTE!!!)
router.put("/api/CrearAnuncio", verifyJWT, async (req,res,next) => {
    const request = new sql.Request();
    try{
        const result = await request.query(`EXEC [dbo].[CrearAnuncio] \'${req.body.fecha_inicio_evento}\', \'${req.body.fecha_fin_evento}\',\'${req.body.ubicacion}\',\'${req.body.descripcion}\',\'${req.body.duracion_inicio}\', \'${req.body.duracion_fin}\', \'${req.body.imagen}\', \'${req.body.titulo}\';`);
        res.sendStatus(200);
    } catch(err){
        next(err)
    }
});

//Crear un nuevo anuncio
router.post('/api/createAnuncio', verifyJWT, async(req, res, next)=>{
    try{
        console.log(req.body.fechaInicio);
        let request = new sql.Request(); 
        request.input('fechaInicio', sql.Date, req.body.fechaInicio);
        request.input('fechaFin', sql.Date, req.body.fechaFin);
        request.input('ubicacion', sql.VarChar(200), req.body.ubicacion);
        request.input('descripcion', sql.VarChar(300), req.body.descripcion);
        request.input('duracionIni', sql.Date, req.body.duracionIni);
        request.input('duracionFin', sql.Date, req.body.duracionFin);
        request.input('imagen', sql.VarChar(8000), req.body.imagen);
        request.input('titulo', sql.VarChar(100), req.body.titulo);
        let result = await request.execute('[dbo].[CrearAnuncio]');
        res.status(200).json({message: 'Anuncio creado con éxito'});
    }catch(err){
        next(err);
    }
});





module.exports = router;
