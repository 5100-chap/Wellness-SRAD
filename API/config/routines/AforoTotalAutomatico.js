const sql = require("mssql");
const cron = require("node-cron");

module.exports = function() {
    cron.schedule("* * * * *", async function () {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const hour = String(currentDate.getHours()).padStart(2, "0");
            const minute = String(currentDate.getMinutes()).padStart(2, "0");
            const second = String(currentDate.getSeconds()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

            var request = new sql.Request();
            const result = await request.query(
                `SELECT * FROM RegistroAforo WHERE inicio <= '${formattedDate}' AND (final >= '${formattedDate}' OR esIndefinido = 1) ORDER BY inicio DESC`
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
