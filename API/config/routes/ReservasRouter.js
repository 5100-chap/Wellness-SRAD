const { request } = require("express");
const express = require("express");
const router = express.Router();
const sql = require("mssql");

const { verifyJWT } = require("../middleware/jwtSecurity");

// Obtener las reservas de un alumno
router.post(
    "/api/getTodasReservasAlumno",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var hoy = new Date();
            var result = await request.query(
                `EXEC [dbo].[GetTodasReservasAlumno] \'${req.body.usuario
                }\', '${hoy.getFullYear()}-${hoy.getMonth + 1 > 9 ? hoy.getMonth() + 1 : `0${hoy.getMonth() + 1}`
                }-${hoy.getDate() > 9 ? hoy.getDate() : `0${hoy.getDate()}`}';`
            );
            res.json(result.recordset);
        } catch (error) {
            res.sendStatus(404);
        }
    }
);

// Obtener reservas de una semana
router.post("/api/getReservasSemanales", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        var result = await request.query(
            `EXEC [dbo].[ObtenerReservasSemanal] \'${req.body.lunes}\', \'${req.body.domingo}\', ${req.body.area_id};`
        );
        res.json(result.recordset);
    } catch (error) {
        res.json({ status: error });
    }
});

// Para crear una reservación
router.put("/api/createReservacionArea", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        await request.query(
            `EXEC [dbo].[CreateReservacionArea] \'${req.body.usuario}\', \'${req.body.fecha}\', \'${req.body.hora}\', \'${req.body.asesor}\', ${req.body.area_id}, \'Activa\';`
        );
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

// Para crear una reservación (alt)
router.put(
    "/api/altCreateReservacionArea",
    verifyJWT,
    async (req, res, next) => {
        var currentTime = new Date();
        var dia = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1
            }-${currentTime.getDate()}`;
        var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[CreateReservacionArea] \'${req.body.usuario}\', \'${dia}\', \'${hora}\', \'${req.body.asesor}\', ${req.body.area_id}, \'Activa\';`
            );
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(404);
        }
    }
);

// Crear una reservación de un Locker
router.post(
    "/api/createReservacionLocker",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[CrearReservaCasillero] \'${req.body.matricula}\', ${req.body.id_casillero};`
            );
        } catch (error) {
            res.json({ status: "error" });
        }
    }
);

// Actualizar el estatus de un locker
router.post(
    "/api/actualizarEstadoLocker",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[ActualizarEstadoCasillero] \ ${req.body.id_casillero},  ${req.body.estado};`
            );
        } catch (error) {
            res.json({ status: "error" });
        }
    }
);

//Revisar si el alumno tiene una reserva de casillero, si la tiene que la obtenga
router.post(
    "/api/consultarReservaCasillero",
    verifyJWT,
    async (req, res, next) => {
        try {
            if (req.body === undefined) {
                res.send(404);
                return;
            }
            var request = new sql.Request();
            var search = `EXEC [dbo].[ExisteReservaCasillero] \'${req.body.matricula}\';`;

            var result = await request.query(search);
            res.send(result.recordset[0]);
        } catch (err) {
            next(err);
        }
    }
);

//Confirmar la reserva de un casillero
router.post(
    "/api/confirmarReservaLocker",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[confirmarReservaCasillero] \ ${req.body.id};`
            );
        } catch (err) {
            next(err);
            res.json({ status: "error" });
        }
    }
);

//Cancelar la reserva de un casillero

router.post("/api/cancelarReservaLocker", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        var result = await request.query(
            `EXEC [dbo].[cancelarReservaCasillero] \ ${req.body.id}, ${req.body.idCasillero};`
        );
    } catch (err) {
        next(err);
        res.json({ status: "error" });
    }
});

//Descartar la reserva de un casillero
router.post("/api/descartaReservaLocker", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        var result = await request.query(
            `EXEC [dbo].[descartarReservaCasillero] \ ${req.body.id};`
        );
    } catch (err) {
        next(err);
        res.json({ status: "error" });
    }
});

//Obtiene todas las reservaciones de los casilleros
router.get("/api/getReservasCasilleros", verifyJWT, async (req, res, next) => {
    const request = new sql.Request();
    try {
        const result = await request.execute("GetReservasCasilleros");
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
});

// Cancelar una reservación en un áre deportiva
router.delete(
    "/api/cancelReservacionArea",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[CancelReservacionArea] \'${req.body.usuario}\', ${req.body.id};`
            );
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "failed" });
        }
    }
);

// Reserva en curso
router.put("/api/reservaEnCurso", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        var result = await request.query(
            `EXEC [dbo].[ReservaEnCurso] ${req.body.id};`
        );
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

//Obtener registros de entreada al gimnasio para el monitor de Ingresos
router.post(
    "/api/getDataMonitorIngresos",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[GetMonitorIngresosRegistros] \'${req.body.dia}\'`
            );
            res.json(result.recordset);
        } catch (error) {
            res.sendStatus(404);
        }
    }
);
//Obtener registros de reservas en las areas deportivas
router.post(
    "/api/getDataMonitorReservas",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            var result = await request.query(
                `EXEC [dbo].[GetMonitorReservasAreas2] \'${req.body.dia}\', \'${req.body.area}\'`
            );
            res.json(result.recordset);
        } catch (error) {
            res.sendStatus(404);
        }
    }
);

//Marcar la salida de un alumno de forma manual
router.post("/api/marcarSalidaAlumno", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        var result = await request.query(
            `EXEC [dbo].[marcarSalidaAlumno] \'${req.body.horaSalida}\', \'${req.body.matricula}\',\'${req.body.horaLlegada}\'`
        );
        res.json(result.recordset);
    } catch (error) {
        res.sendStatus(404);
    }
});

// Marcar Entrada desde una reserva
router.post("/api/marcarLlegadaReserva", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        const currentTime = new Date();
        var dia = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1
            }-${currentTime.getDate()}`;
        var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
        var result = await request.query(
            `EXEC [dbo].[MarcarLlegadaReserva] \'${req.body.usuario}\', \'${hora}\', \'${dia}\', ${req.body.area_id}, ${req.body.id_reservacion};`
        );
    } catch (error) {
        res.json({ status: "error" });
    }
});

// Marcar Salida desde una reserva
router.post("/api/marcarSalidaReserva", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        const currentTime = new Date();
        var hora = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
        await request.query(
            `EXEC [dbo].[MarcarSalida] \'${hora}\', \'${req.body.usuario}\';EXEC [dbo].[MarcarSalidaReserva] ${req.body.id};`
        );
    } catch (error) {
        res.json({ status: "error" });
    }
});

// Mostrar lista de asesores por rol
router.post("/api/getAsesoresPorRol", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        const result = request.query(
            `EXEC [dbo].[GetAsesoresPorRol] '${req.body.rol}';`
        );
        res.json((await result).recordset);
    } catch (error) {
        res.sendStatus(404);
    }
});

// Obtener reservas de asesores
router.post("/api/getReservasAsesores", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        const result = await request.query(
            `EXEC [dbo].[GetReservasAsesor] '${req.body.lunes}', '${req.body.domingo}', '${req.body.asesor}';`
        );
        res.json(result.recordset);
    } catch (error) {
        res.sendStatus(404);
    }
});

// Crear una reserva para asesor
router.post("/api/createReservaAsesor", verifyJWT, async (req, res, next) => {
    try {
        var request = new sql.Request();
        const result = await request.query(
            `EXEC [dbo].[CreateReservaAsesor] '${req.body.asesor}', '${req.body.lugar}', '${req.body.fecha}', '${req.body.usuario}', '${req.body.hora}', ${req.body.cancelada};`
        );
    } catch (error) {
        res.sendStatus(404);
    }
});

// Obtener reservas de asesor del estudiante
router.post(
    "/api/getReservasAsesorDeAlumno",
    verifyJWT,
    async (req, res, next) => {
        try {
            var request = new sql.Request();
            const hoy = new Date();
            const result = await request.query(
                `EXEC [dbo].[GetReservasAsesorDeAlumno] '${req.body.usuario
                }', '${hoy.getFullYear()}-${hoy.getMonth + 1 > 9 ? hoy.getMonth() + 1 : `0${hoy.getMonth() + 1}`
                }-${hoy.getDate() > 9 ? hoy.getDate() : `0${hoy.getDate()}`}';`
            );
            res.json(result.recordset);
        } catch (error) {
            res.json(error);
        }
    }
);

//Obtener las reservas activas del alumno para el calendario
router.post("/api/getEventos", async (req, res, next) => {
    try {
        var request = new sql.Request();
        var hoy = new Date();
        var result = await request.query(
            `EXEC [dbo].[GetEventos] \'${req.body.usuario}\';`
        );
        res.json(result.recordset);
    } catch (error) {
        res.sendStatus(404);
    }
});
// Cancelar todas las reservas en caso de cierre de un área
router.put("/api/cancelarTodasDeArea", async (req, res, next) => {
    try {
        var request = new sql.Request();
        await request.query(``);
        res.json("ok");
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;
