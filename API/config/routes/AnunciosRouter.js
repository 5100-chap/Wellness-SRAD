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


module.exports = router;
