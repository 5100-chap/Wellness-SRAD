const express = require("express");
const router = express.Router();
const sql = require("mssql");
const fs = require("fs");

const multer = require("multer");
const upload = multer({ dest: 'uploads/' }); // sube los archivos a la carpeta 'uploads'

const blobServiceClient = require('../credentials/blobStorage'); // asegúrate de que esta ruta es correcta

const { verifyJWT } = require("../middleware/jwtSecurity");

router.post('/api/upload', verifyJWT, upload.single('image'), async (req, res, next) => {
    try {
        // Sube el archivo a Blob Storage
        const blobName = Date.now() + req.file.originalname;
        const containerClient = blobServiceClient.getContainerClient('wellness-files');
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

router.delete('/api/deleteImagen', verifyJWT, async (req, res, next) => {
    try {
        // Elimina el archivo de Blob Storage
        const blobUrl = req.query.blobUrl; // Obtén la URL del blob del query de la solicitud
        const blobName = blobUrl.substring(blobUrl.lastIndexOf("/") + 1); // Extrae el nombre del blob de la URL
        const containerClient = blobServiceClient.getContainerClient('wellness-files'); 
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const deleteBlobResponse = await blockBlobClient.delete();
        res.status(200).json({ message: 'Imagen eliminada con éxito' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
