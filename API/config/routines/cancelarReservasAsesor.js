const sql = require("mssql");

const cancelReservaAsesorAuto = async () => {
    try{
        const now = new Date();
        const consulta = `UPDATE ReservaAsesor SET ReservaAsesor.cancelada = 1 WHERE ReservaAsesor.llegada IS NULL AND ReservaAsesor.cancelada = 0 AND ((CAST('${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' AS DATE) > ReservaAsesor.fecha) OR ((CAST('${now.getFullYear()}-${(now.getMonth()+1>9)?now.getMonth()+1:`0${now.getMonth()+1}`}-${now.getDate()}' AS DATE)) = ReservaAsesor.fecha) AND (DATEADD(MINUTE, 15, CAST(ReservaAsesor.hora AS TIME)) < '${now.getHours()}:${(now.getMinutes()>9)?now.getMinutes():`0${now.getMinutes()}`}:${(now.getSeconds()>9)?now.getSeconds():`0${now.getSeconds()}`}'));`;
        const request = new sql.Request();
        await request.query(consulta);
    }   
    catch(err){
        console.error('Error executing query: ', err);
    }
}

module.exports = cancelReservaAsesorAuto;