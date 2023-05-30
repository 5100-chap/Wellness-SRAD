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
        var request = new sql.Request();       
        var result = await request.query(`EXEC [dbo].[CrearAnuncio] \'${req.body.fechaInicio}\', \'${req.body.fechaFin}\', \'${req.body.ubicacion}\', \'${req.body.descripcion}\', \'${req.body.duracionIni}\', \'${req.body.duracionFin}\', \'${req.body.imagen}\', \'${req.body.titulo}\'`);
    }catch(error){
        console.log(error);
        res.json({'status': 'error'});
    }
});





module.exports = router;
