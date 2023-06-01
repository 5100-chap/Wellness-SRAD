const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

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


//Crear un nuevo anuncio
router.post('/api/createAnuncio', async(req, res, next)=>{
    try{
        console.log(req.body.fechaInicio);
        let request = new sql.Request(); 
        request.input('fechaInicio', sql.Date, req.body.fechaInicio);
        request.input('fechaFin', sql.Date, req.body.fechaFin);
        request.input('ubicacion', sql.VarChar(200), req.body.ubicacion);
        request.input('descripcion', sql.VarChar(300), req.body.descripcion);
        request.input('duracionIni', sql.Date, req.body.duracionIni);
        request.input('duracionFin', sql.Date, req.body.duracionFin);
        request.input('imagen', sql.VarChar(1000), req.body.imagen);
        request.input('titulo', sql.VarChar(100), req.body.titulo);
        let result = await request.execute('[dbo].[CrearAnuncio]');
        res.status(200).json({message: 'Anuncio creado con éxito'});
    }catch(err){
        next(err);
    }
});





module.exports = router;
