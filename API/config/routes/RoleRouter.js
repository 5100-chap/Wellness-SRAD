const express = require("express");
const router = express.Router();
const sql = require("mssql");

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const { verifyJWT } = require("../middleware/jwtSecurity");

router.post("/api/login", async (req, res, next) => {
    try {
        // Almacena el usuario y contraseña
        const { username, password } = req.body;

        // Creacion de variables de query para buscar
        var result;
        const roles = [
            {
                role: "Alumno",
                IdForm: "Matricula",
                param: "matricula",
                type: sql.Char(9),
            },
            {
                role: "Director",
                IdForm: "Nomina",
                param: "numero_nomina",
                type: sql.VarChar(30),
            },
            {
                role: "Administrador",
                IdForm: "Nomina",
                param: "numero_nomina",
                type: sql.VarChar(30),
            },
            {
                role: "Instructor",
                IdForm: "Nomina",
                param: "numero_nomina",
                type: sql.VarChar(30),
            },
        ];

        for (const { role, param, type, IdForm } of roles) {
            const request = new sql.Request();
            request.input(param, type, username);

            result = await request.execute(`Get${role}By${IdForm}`);

            if (result.recordset.length === 1) {
                result.recordset[0].role = role;
                if (result.recordset[0].contrasena !== password) {
                    result.recordset = null;
                    res.status(401).send("Unauthorized");
                    return;
                }
                break;
            }
        }

        if (result.recordset.length !== 1) {
            result.recordset = null;
            res.status(401).send("Unauthorized");
            return;
        }

        // Genera un token JWT
        const token = jwt.sign(
            { username: username, role: result.recordset[0].role },
            secretKey,
            { expiresIn: "1h" }
        );

        // Elimina la contraseña del objeto antes de enviarlo
        delete result.recordset[0].contrasena;

        res.send({ token: token, user: result.recordset });
    } catch (err) {
        next(err);
    }
});

router.get("/api/refresh", verifyJWT, async (req, res, next) => {
    try {
        // Decodifica el token
        const decodedToken = jwt.decode(req.token);
        
        // Calcula la diferencia entre el tiempo actual y la emisión del token
        const now = Date.now() / 1000; // Convertir a segundos
        const age = now - decodedToken.iat;

        // Si el token fue emitido hace menos de 15 minutos, genera uno nuevo
        if (age < 15 * 60) {
            // Genera un nuevo token JWT
            const newToken = jwt.sign(
                { username: req.username, role: req.role },
                secretKey,
                { expiresIn: "1h" }
            );

            res.send({ token: newToken });
        } else {
            res.status(400).send({ error: "Token demasiado antiguo" });
        }
    } catch (err) {
        next(err);
    }
});


module.exports = router;
