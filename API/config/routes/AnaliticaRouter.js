const moment = require("moment");
const _ = require("lodash");
const ss = require("simple-statistics");
const sql = require("mssql");
const express = require("express");
const router = express.Router();

/* Funciones de Tendencia por semana */
// Esta función genera la consulta SQL para un segmento y bloque específico
function generarConsultaSQL(segmento, bloque, semana) {
    let fechaInicio, fechaFin;

    switch (segmento) {
        case "invierno":
            fechaInicio = moment().startOf("year").startOf("isoWeek").add(1, "week").add(semana, "weeks"); // Primer lunes de enero
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        case "primer_semestre":
            fechaInicio = moment()
                .month("February")
                .startOf("month")
                .startOf("isoWeek")
                .add(2, "weeks")
                .add(bloque * 6 + semana, "weeks"); // Tercer lunes de febrero
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        case "verano":
            fechaInicio = moment().month("June").endOf("month").startOf("isoWeek").add(semana, "weeks"); // Última semana de junio
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
        case "segundo_semestre":
            fechaInicio = moment()
                .month("August")
                .startOf("month")
                .startOf("isoWeek")
                .add(1, "week")
                .add(bloque * 6 + semana, "weeks"); // Segundo lunes de agosto
            fechaFin = moment(fechaInicio).add(1, "weeks");
            break;
    }

    return `SELECT DATEPART(week, fecha) as Semana, COUNT(*) as Asistencias
            FROM Registro
            WHERE fecha >= '${fechaInicio.format(
        "YYYY-MM-DD"
    )}' AND fecha < '${fechaFin.format("YYYY-MM-DD")}'
            GROUP BY DATEPART(week, fecha)
            ORDER BY Semana;`;
}

//Funcion para calcular la mediana
function mediana(array) {
    array.sort((a, b) => a - b);
    const half = Math.floor(array.length / 2);

    if (array.length % 2) return array[half];
    return (array[half - 1] + array[half]) / 2.0;
}

// Esta función recupera y procesa los datos de asistencia para un segmento y bloque específicos
async function obtenerTendencias(segmento, bloque, semana, metricas) {
    let consultaSQL = generarConsultaSQL(segmento, bloque, semana);

    try {
        let result = await sql.query(consultaSQL);

        let tendencias = {};

        if (metricas.includes("media")) {
            tendencias.media = _.meanBy(result.recordset, "Asistencias");
        }

        if (metricas.includes("maximo")) {
            tendencias.maximo = _.maxBy(result.recordset, "Asistencias");
        }

        if (metricas.includes("minimo")) {
            tendencias.minimo = _.minBy(result.recordset, "Asistencias");
        }

        if (metricas.includes("mediana")) {
            tendencias.mediana = mediana(
                result.recordset.map((item) => item.Asistencias)
            );
        }

        if (metricas.includes("desviacionEstandar")) {
            tendencias.desviacionEstandar = ss.standardDeviation(
                result.recordset.map((item) => item.Asistencias)
            );
        }
        return tendencias;
    } catch (err) {
        console.log(err);
    }
}

// Aquí utilizamos las funciones en un endpoint de la API
router.get("/api/tendencias/:segmento/:bloque/:semana", async (req, res) => {
    let segmento = req.params.segmento;
    let bloque = parseInt(req.params.bloque);
    let semana = parseInt(req.params.semana);

    let media = await obtenerTendencias(segmento, bloque, semana);

    res.json({ media });
});



/** Funciones de tendencia por dia */
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
        let gruposPorHora = _.groupBy(result.recordset, 'Hora');

        // Calculamos las estadísticas para cada grupo
        for (let [hora, datos] of Object.entries(gruposPorHora)) {
            let asistencias = datos.map(item => item.Asistencias);

            tendenciasPorHora[hora] = {
                media: _.mean(asistencias),
                maximo: _.max(asistencias),
                minimo: _.min(asistencias),
                desviacionEstandar: ss.standardDeviation(asistencias),
            };
        }

        return tendenciasPorHora;
    } catch (err) {
        console.log(err);
    }
}

// Aquí utilizamos las funciones en un endpoint de la API
router.get("/api/tendencias_por_hora/:dia", async (req, res) => {
    let dia = req.params.dia;

    let tendencias = await obtenerTendenciasPorHora(dia);

    res.json(tendencias);
});

module.exports = router;
