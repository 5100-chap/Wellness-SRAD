const express = require("express");
const router = express.Router();
const sql = require("mssql");

const { execute } = require("@angular-devkit/build-angular/src/builders/extract-i18n");
const { async } = require("rxjs");

const { verifyJWT } = require("../middleware/jwtSecurity");


//Obtener la información de todas la areas deportivas
router.get("/api/AreaInformacion", verifyJWT, async (req, res, next) => {
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
router.get("/api/getNombresAreas", verifyJWT, async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('GetNombreAreasDeportivas');
        res.json(result.recordset);

    } catch (err){
        next(err);
    }

});

//Consigue la lista de todos los casilleros disponibles
router.get("/api/getCasillerosDisponibles", verifyJWT, async (req,res, next) =>{
    const request = new sql.Request();
    try{
        const result = await request.execute('getCasillerosDisponibles');
        res.json(result.recordset);

    } catch (err){
        next(err);
    }

});

//Obtiene la información de todas las areas deportivas
router.get("/api/TodasAreasInformacion", verifyJWT, async (req, res, next) => {
    const request = new sql.Request();
    try {
        const result = await request.execute('TodasAreasInformacion');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

//Actualizar el estado de un area deportiva
router.put("/api/AreaUpdateStatus", verifyJWT, async (req, res, next) => {
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

//Actualizar un area a cerrada
router.post("/api/AreaUpdateClose", verifyJWT, async (req, res, next) => {
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
router.post('/api/CrearArea', verifyJWT, async(req,res,next) =>{
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

// Modificar el área 
router.post('/api/EditarArea', verifyJWT, async(req,res,next) => {
    try{
        let request = new sql.Request();

        let hCierre = new Date(`1970-01-01T${req.body.hCierre}Z`);
        let hApertura = new Date(`1970-01-01T${req.body.hApertura}Z`);        
        
        request.input('id',sql.Int,req.body.id);
        request.input('nombre',sql.VarChar(50),req.body.nombre);
        request.input('descrip',sql.VarChar(300),req.body.descrip);
        request.input('ubicacion',sql.VarChar(200),req.body.ubicacion);
        request.input('matDisp',sql.VarChar(200),req.body.matDisp);
        request.input('imag',sql.VarChar(8000),req.body.imag);
        request.input('hCierre',sql.Time(7), hCierre);
        request.input('hApertura',sql.Time(7), hApertura);
        let result = await request.execute('[dbo].[EditarArea]');
        res.status(200).json({message: 'Area editada con éxito'});        
    }catch(err){
        next(err)
    }
});

// Eliminar un área por su ID
router.delete("/api/EliminarArea/:id", verifyJWT, async (req, res, next) => {
    const idArea = req.params.id;
    const request = new sql.Request();
    try {
        const result = await request
            .input('idArea', sql.Int, idArea)
            .execute('EliminarArea');
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});
// Crear una reseña de un area deportiva
router.post('/api/calificarArea', async(req,res,next) => {
    try{
        var request = new sql.Request();
        await request.query(`EXEC [dbo].[calificarArea] ${req.body.idArea}, \'${req.body.rubro1}\', \'${req.body.rubro2}\', \'${req.body.rubro3}\',${req.body.calif1},${req.body.calif2},${req.body.calif3};`);
    }
    catch(error){
        res.json(error);
    }
    
})


module.exports = router;