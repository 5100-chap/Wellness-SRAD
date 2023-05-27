const sql = require("mssql");

const cancelAuto = async () => {
    try {
        const now = new Date();

        const consulta = `
        UPDATE Reservacion 
        SET estado = 'Cancelada' 
        WHERE fecha <= '${now.toISOString()}' 
        AND DATEADD(MINUTE, 15, CAST(hora AS TIME)) <= CAST(GETDATE() AS TIME) 
        AND estado != 'Completada' AND estado != 'En curso';
    `;

        const request = new sql.Request();
        const result = await request.query(consulta);
        console.log(result.recordset);
    } catch (err) {
        console.error('Error executing query:', err);
    }
}

module.exports = cancelAuto;
