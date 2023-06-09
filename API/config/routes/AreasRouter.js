const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");
const { execute } = require("@angular-devkit/build-angular/src/builders/extract-i18n");


//Obtener la información de todas la areas deportivas
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

//Obtiene el nombre de todas las areas deportivas
router.get("/api/getNombresAreas", async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('GetNombreAreasDeportivas');
        res.json(result.recordset);

    } catch (err){
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

//Obtiene la información de todas las areas deportivas
router.get("/api/TodasAreasInformacion", async (req, res, next) => {
    const request = new sql.Request();
    try {
        const result = await request.execute('TodasAreasInformacion');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

//Actualizar el estado de un area deportiva
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

router.post("/api/AreaUpdateClose", async (req, res, next) => {
    const areaId = req.body.areaId;
    const fechaCierre = req.body.fechaCierre;
    const fechaApertura = req.body.fechaApertura;
    const diaActual = new Date();
    const request = new sql.Request();
    try {
        const result = await request
            .input('AreaId', sql.Int, areaId)
            .input('FechaCierre', sql.DateTime, fechaCierre)
            .input('FechaApertura', sql.DateTime, fechaApertura)
            .input('DiaActual', sql.DateTime, diaActual)
            .execute('CerrarArea');
        res.json({success: ''});
    } catch (err) {
        next(err);
    }
});

// Crear Area 
router.post('/api/CrearArea', async(req,res,next) =>{
    try{
        let hCierre = new Date(`1970-01-01T${req.body.hCierre}Z`);
        let hApertura = new Date(`1970-01-01T${req.body.hApertura}Z`);        
        
        let request = new sql.Request();
        request.input('nombre',sql.VarChar(50),req.body.nombre);
        request.input('descrip',sql.VarChar(300),req.body.descrip);
        request.input('lugDisp',sql.Int,req.body.lugDisp);
        request.input('lugTotales',sql.Int,req.body.lugTotales);
        request.input('ubicacion',sql.VarChar(200),req.body.ubicacion);
        request.input('matDisp',sql.VarChar(200),req.body.matDisp);
        request.input('estatus',sql.Bit,req.body.estatus);
        request.input('fechaCierre',sql.DateTime,req.body.fechaCierre);
        request.input('fechaApertura',sql.DateTime,req.body.fechaApertura);
        request.input('imag',sql.VarChar(8000),req.body.imag);
        request.input('hCierre',sql.Time(7), hCierre);
        request.input('hApertura',sql.Time(7), hApertura);
        let result = await request.execute('[dbo].[CrearArea]');
        res.status(200).json({message: 'Area creada con éxito'});        
    }catch(err){
        next(err)
    }
});


module.exports = router;