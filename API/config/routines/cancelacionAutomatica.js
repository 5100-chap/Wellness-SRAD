const sql = require("mssql");

const cancelAuto = async () => {
    try {
        const now = new Date();
        const consulta = `UPDATE Reservacion SET Razon = 0 WHERE fecha < '${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' OR (DATEADD(MINUTE, 15, CAST(hora AS TIME)) <= CAST('${now.getHours()}:${(now.getMinutes()>9)?now.getMinutes():`0${now.getMinutes()}`}:${(now.getSeconds()>9)?now.getSeconds():`0${now.getSeconds()}`}' AS TIME) AND fecha = CAST('${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' AS DATE)) AND estado != 'Completada' AND estado != 'En curso' AND estado != 'Terminada'; UPDATE Reservacion SET estado = 'Cancelada' WHERE fecha < '${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' OR (DATEADD(MINUTE, 15, CAST(hora AS TIME)) <= CAST('${now.getHours()}:${(now.getMinutes()>9)?now.getMinutes():`0${now.getMinutes()}`}:${(now.getSeconds()>9)?now.getSeconds():`0${now.getSeconds()}`}' AS TIME) AND fecha = CAST('${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' AS DATE)) AND estado != 'Completada' AND estado != 'En curso' AND estado != 'Terminada';`;
        const request = new sql.Request();
        const result = await request.query(consulta);
    } catch (err) {
        console.error('Error executing query:', err);
    }
}

module.exports = cancelAuto;
