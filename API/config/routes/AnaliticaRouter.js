const moment = require("moment");
const _ = require("lodash");
const ss = require("simple-statistics");
const sql = require("mssql");
const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../middleware/jwtSecurity");

// Esta función genera la consulta SQL para un segmento y bloque específico
/* Funciones de Tendencia por día de la semana */
// Esta función genera la consulta SQL para un segmento y bloque específico
function generarConsultaSQL(segmento, bloque, semana) {
    let fechaInicio, fechaFin;
    let year = moment().year();

    switch (segmento) {
        case "invierno":
            fechaInicio = moment()
                .year(year - 1)
                .startOf("year")
                .startOf("isoWeek")
                .add(1, "week")
                .add(semana, "weeks"); // Primer lunes de enero
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        case "primer_semestre":
        case "segundo_semestre":
            fechaInicio = moment()
                .year(year)
                .month(segmento === "primer_semestre" ? "February" : "August")
                .startOf("month")
                .startOf("isoWeek")
                .add(segmento === "primer_semestre" ? 2 : 1, "weeks")
                .add(bloque * 6 + semana, "weeks");
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        case "verano":
            fechaInicio = moment()
                .year(year - 1)
                .month("June")
                .endOf("month")
                .startOf("isoWeek")
                .add(semana, "weeks"); // Última semana de junio
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        default:
            throw new Error(`Segmento no válido: ${segmento}`);
    }

    return `SELECT DATEPART(dw, fecha) as Dia, COUNT(*) as Asistencias
            FROM Registro
            WHERE fecha >= '${fechaInicio.format(
        "YYYY-MM-DD"
    )}' AND fecha < '${fechaFin.format("YYYY-MM-DD")}'
            GROUP BY DATEPART(dw, fecha)
            ORDER BY Dia;`;
}

// Esta función recupera y procesa los datos de asistencia para un segmento y bloque específicos
async function obtenerTendencias(segmento, bloque, semana, metricas) {
    let consultaSQL = generarConsultaSQL(segmento, bloque, semana);

    try {
        let result = await sql.query(consultaSQL);

        let tendencias = {};
        /*Después de obtener las tendencias para la semana actual, se realiza una segunda consulta 
        para obtener las tendencias para el bloque anterior (o el mismo periodo del año anterior para 
        invierno y verano), y se añade esta información al objeto tendencias que se devuelve. */
        for (let i = 1; i <= 7; i++) {
            let recordsForDay = result.recordset.filter((item) => item.Dia === i);

            if (!metricas || metricas.includes("media")) {
                tendencias["Dia" + i + "_media"] = _.meanBy(
                    recordsForDay,
                    "Asistencias"
                );
            }

            if (!metricas || metricas.includes("maximo")) {
                tendencias["Dia" + i + "_maximo"] = _.maxBy(
                    recordsForDay,
                    "Asistencias"
                );
            }

            if (!metricas || metricas.includes("minimo")) {
                tendencias["Dia" + i + "_minimo"] = _.minBy(
                    recordsForDay,
                    "Asistencias"
                );
            }

            if (!metricas || metricas.includes("mediana")) {
                tendencias["Dia" + i + "_mediana"] = mediana(
                    recordsForDay.map((item) => item.Asistencias)
                );
            }

            if (!metricas || metricas.includes("desviacionEstandar")) {
                tendencias["Dia" + i + "_desviacionEstandar"] = ss.standardDeviation(
                    recordsForDay.map((item) => item.Asistencias)
                );
            }
        }
        return tendencias;
    } catch (err) {
        throw new Error("Error al obtener las tendencias");
    }
}

//Funcion para calcular la mediana
function mediana(array) {
    array.sort((a, b) => a - b);
    const half = Math.floor(array.length / 2);

    if (array.length % 2) return array[half];
    return (array[half - 1] + array[half]) / 2.0;
}

// Aquí utilizamos las funciones en un endpoint de la API
router.get("/api/tendencias/:segmento/:bloque/:semana", verifyJWT, async (req, res) => {
    try {
        let segmento = req.params.segmento;
        let bloque = parseInt(req.params.bloque);
        let semana = parseInt(req.params.semana);

        let metricas = [
            "media",
            "maximo",
            "minimo",
            "mediana",
            "desviacionEstandar",
        ];
        let tendencias = await obtenerTendencias(
            segmento,
            bloque,
            semana,
            metricas
        );

        res.json({ tendencias });
    } catch (err) {
        res
            .status(500)
            .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
});

/** Funciones de tendencia por día */
// Esta función genera la consulta SQL para un día específico
function generarConsultaSQLPorHora(dia) {
    let fecha = moment(dia, "YYYY-MM-DD").format("YYYY-MM-DD"); // Aseguramos que la fecha esté en el formato correcto

    return `SELECT DATEPART(hour, hora_de_llegada) as Hora, COUNT(*) as Asistencias
            FROM Registro
            WHERE CAST(fecha AS DATE) = '${fecha}' AND hora_de_llegada BETWEEN '06:00:00' AND '22:00:00'
            GROUP BY DATEPART(hour, hora_de_llegada)
            ORDER BY Hora;`;
}

// Esta función recupera y procesa los datos de asistencia para un día específico
async function obtenerTendenciasPorHora(dia) {
    let consultaSQL = generarConsultaSQLPorHora(dia);

    try {
        let result = await sql.query(consultaSQL);
        let tendenciasPorHora = {};

        // Agrupamos los datos por hora
        let gruposPorHora = _.groupBy(result.recordset, "Hora");

        // Calculamos las estadísticas para cada grupo
        for (let [hora, datos] of Object.entries(gruposPorHora)) {
            let asistencias = datos.map((item) => item.Asistencias);

            tendenciasPorHora[hora] = {
                media: _.mean(asistencias),
                maximo: _.max(asistencias),
                minimo: _.min(asistencias),
                desviacionEstandar: ss.standardDeviation(asistencias),
            };
        }

        return tendenciasPorHora;
    } catch (err) {
        throw new Error("Error al obtener las tendencias por hora");
    }
}

// Aquí utilizamos las funciones en un endpoint de la API
router.get("/api/tendencias_por_hora/:dia", verifyJWT, async (req, res) => {
    try {
        let dia = req.params.dia;

        let tendencias = await obtenerTendenciasPorHora(dia);

        res.json(tendencias);
    } catch (err) {
        res
            .status(500)
            .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
});

// Obtener las reseñas de un area deportiva
router.post("/api/obtenerCalifArea", async (req, res) => {
    try {
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[obtenerCalifArea] ${req.body.idArea} ;`);
        res.json(result.recordset);

    }
    catch (error) {
        console.error(error)
        res.json(error);
    }
})


//Obtener el numero total de registros de un rubro que se pase como parametro
router.post("/api/obtenerNumeroRegistrosRubro", async (req, res) => {
    try {
        var request = new sql.Request();
        var result = await request.query(`EXEC [dbo].[obtenerNumeroRegistrosRubro] ${req.body.idArea}, \'${req.body.rubro}\' ;`);
        res.json(result.recordset);
    }
    catch (error) {
        res.json(error);
    }
})




// Retorna los días escolares dependiendo del semestre en el que se está cursando
function getDiasEscolares(fechaSeleccionada) {
    let year = moment().year();

    let fechaInicioInv = moment()
        .year(year)
        .startOf("year")
        .startOf("isoWeek")
        .add(1, "week")
    let fechaFinalInv = moment(fechaInicioInv)
        .add(5, "weeks")

    fechaInicioInv = new Date(fechaInicioInv.format("YYYY-MM-DD"));
    fechaFinalInv = new Date(fechaFinalInv.format("YYYY-MM-DD"));

    let fechaInicioPrimer = moment()
        .year(year)
        .month("February")
        .startOf("month")
        .startOf("isoWeek")
        .add(2, "weeks")
    let fechaFinalPrimer = moment(fechaInicioPrimer)
        .add(19, "weeks")

    fechaInicioPrimer = new Date(fechaInicioPrimer.format("YYYY-MM-DD"));
    fechaFinalPrimer = new Date(fechaFinalPrimer.format("YYYY-MM-DD"))

    let fechaInicioSegundo = moment()
        .year(year)
        .month("August")
        .startOf("month")
        .startOf("isoWeek")
        .add(1, "weeks")
    let fechaFinalSegundo = moment(fechaInicioSegundo)
        .add(18, "weeks")

    fechaInicioSegundo = new Date(fechaInicioSegundo.format("YYYY-MM-DD"));
    fechaFinalSegundo = new Date(fechaFinalSegundo.format("YYYY-MM-DD"));

    let fechaInicioVerano = moment()
        .year(year)
        .month("June")
        .endOf("month")
        .startOf("isoWeek")
    let fechaFinalVerano = moment(fechaInicioVerano)
        .add(5, "weeks")

    fechaInicioVerano = new Date(fechaInicioVerano.format("YYYY-MM-DD"));
    fechaFinalVerano = new Date(fechaFinalVerano.format("YYYY-MM-DD"));
    // Recibe el lunes de la semana "fechaSeleccionada"
    var res = false;

    if (fechaInicioInv <= fechaSeleccionada && fechaFinalInv > fechaSeleccionada) {
        res = true;
    }
    else if (fechaInicioPrimer <= fechaSeleccionada && fechaFinalPrimer > fechaSeleccionada) {
        res = true;
    }
    else if (fechaInicioSegundo <= fechaSeleccionada && fechaFinalSegundo > fechaSeleccionada) {
        res = true;
    }
    else if (fechaInicioVerano <= fechaSeleccionada && fechaFinalVerano > fechaSeleccionada) {
        res = true;
    }

    if (res) {
        // Obtener la fecha actual
        var fechaActual = new Date();

        // Sumar 14 días a la fecha actual
        fechaActual.setDate(fechaActual.getDate() + 7);

        // Comparar las fechas
        if (fechaActual > fechaSeleccionada) {
            res = true
        }
        else {
            res = false
        }


    }

    return res;
}

// Obtener los datos de dias escolares
// En base al lunes de la semana seleccionada
// Se revisará si está en periodo escolar
router.get('/api/getDiasEscolares/:lunes/', async (req, res, next) => {
    try {
        res.json(getDiasEscolares(new Date(req.params.lunes)));
    }
    catch (err) {
        throw new Error("Error al obtener los datos");
        res.json(err);
    }
});

module.exports = router;
