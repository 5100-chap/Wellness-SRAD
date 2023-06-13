const express = require("express");
const router = express.Router();
const sql = require("mssql");
const queries = require("../database/queries");

router.get("/api/getXCredentials", async (req, res, next) => {
    try {
        // Consigue el header de autentificacion
        const authHeader = req.headers.authorization;

        // Checa si el header tiene autentificación basica
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.status(401).send('Unauthorized');
            return;
        }

        // Decodifica las crendenciales
        const encodedCredentials = authHeader.slice('Basic '.length);
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();

        // Almacena el usuario y contraseña
        const [username, password] = decodedCredentials.split(':');
        // Creacion de variables de query para buscar
        var result;
        const roles = [
            { role: 'Alumno', IdForm: "Matricula", param: 'matricula', type: sql.Char(9) },
            { role: 'Director', IdForm: "Nomina", param: 'numero_nomina', type: sql.VarChar(30) },
            { role: 'Administrador', IdForm: "Nomina", param: 'numero_nomina', type: sql.VarChar(30) },
            { role: 'Instructor', IdForm: "Nomina", param: 'numero_nomina', type: sql.VarChar(30) },
        ];

        for (const { role, param, type, IdForm } of roles) {
            const request = new sql.Request();
            request.input(param, type, username);

            result = await request.execute(`Get${role}By${IdForm}`);

            if (result.recordset.length === 1) {
                result.recordset[0].role = role;
                if (result.recordset[0].contrasena !== password) {
                    console.log("Triggered password error");
                    result.recordset = null;
                    res.status(401).send('Unauthorized');
                    return;
                }
                break;
            }
        }

        if (result.recordset.length !== 1) {
            console.log("Triggered illegal instruction");
            result.recordset = null;
            res.status(401).send('Unauthorized');
            return;
        }

        res.send(result.recordset);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
