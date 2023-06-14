const express = require("express");
const router = express.Router();
const sql = require("mssql");
const fs = require("fs");

const multer = require("multer");
const upload = multer({ dest: 'uploads/' }); // sube los archivos a la carpeta 'uploads'

const blobServiceClient = require('../credentials/blobStorage'); // asegúrate de que esta ruta es correcta

//Metodo para subir imagenes a la base de datos
router.post('/api/upload', upload.single('image'), async (req, res, next) => {
    try {
        // Sube el archivo a Blob Storage
        const blobName = Date.now() + req.file.originalname;
        const containerClient = blobServiceClient.getContainerClient('wellness-files'); // reemplaza 'mycontainer' con el nombre de tu contenedor
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.uploadStream(fs.createReadStream(req.file.path));

        console.log(`Archivo subido a Blob Storage con éxito. requestId: ${uploadBlobResponse.requestId}`);

        // Genera la URL del blob
        const blobUrl = blockBlobClient.url;

        // Inserta la URL en tu base de datos en la tabla correspondiente
        const request = new sql.Request();
        request.input('blobUrl', sql.VarChar(256), blobUrl);
        request.input('id_reserva', sql.Int, req.body.id_reserva);
        request.input('id_anuncio', sql.Int, req.body.id_anuncio);
        request.input('id_area', sql.Int, req.body.id_area);
        await request.execute('UpdateImageUrls');
        //Regresa un json que registra que se ha realizado el registro con exito
        res.status(200).json({ message: 'Imagen subida con éxito y URL registrada en la base de datos.', blobUrl: blobUrl });
    } catch (err) {
        next(err);
    }
});



//obtener la imagen de un asesor
router.post('/api/getImagenAsesor', async(req, res, next)=>{
    try{
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[getImagenAsesor] '${req.body.id}';`);
        res.json(result.recordset);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
});

module.exports = router;
