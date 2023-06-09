const sql = require("mssql");
const cron = require("node-cron");

module.exports = function () {
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
            const result = await request.query(`SELECT * FROM Area WHERE fecha_cierre IS NOT NULL AND fecha_apertura IS NOT NULL; UPDATE Reservacion SET estado = 'Cancelada' WHERE estado = 'Activa' AND id_area_deportiva IN (SELECT id FROM Area WHERE estatus = 0);`
            );
            const areas = result.recordset;

            for (const area of areas) {
                let status;
                let fecha_cierre;
                if (
                    currentDate >= area.fecha_cierre &&
                    currentDate <= area.fecha_apertura
                ) {
                    status = 0;
                    fecha_cierre = area.fecha_cierre;
                } else {
                    status = 1;
                    fecha_cierre =
                        formattedDate > area.fecha_cierre ? null : area.fecha_cierre;
                }
                const updateRequest = new sql.Request();
                updateRequest.input('status', sql.Int, status);
                updateRequest.input('fecha_cierre', sql.DateTime, fecha_cierre);
                updateRequest.input('id', sql.Int, area.id);

                await updateRequest.query(`UPDATE Area SET estatus = @status, fecha_cierre = @fecha_cierre WHERE id = @id`);
            }
        } catch (err) {
            console.error(err);
        }
    });
};
