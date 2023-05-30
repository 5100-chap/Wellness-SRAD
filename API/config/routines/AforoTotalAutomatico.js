const sql = require("mssql");
const database = require("../credentials/database");
const cron = require("node-cron");

module.exports = function() {
    cron.schedule("* * * * *", async function () {
        try {
            await sql.connect(database.config); // Necesitamos conectar a la base de datos
            var request = new sql.Request();
            const result = await request.query(
                "SELECT * FROM RegistroAforo WHERE inicio <= GETDATE() AND (final >= GETDATE() OR esIndefinido = 1) ORDER BY inicio DESC"
            );
            const aforos = result.recordset;
    
            for (const aforo of aforos) {
                const updateArea = `UPDATE Area SET lugares_totales = ${aforo.aforo_registrado} WHERE id = ${aforo.area_id}`;
                await request.query(updateArea);
            }
        } catch (err) {
            console.error(err);
        }
    });
};
