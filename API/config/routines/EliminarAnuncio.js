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
            const result = await request.query(
                `SELECT id, titulo, fecha_inicio_evento,fecha_fin_evento, ubicacion, descripcion, imagen, duracion_inicio, duracion_fin
                FROM Anuncio WITH(NOLOCK)`
            );
            const anuncios = result.recordset;

            for (const anuncio of anuncios) {
                if (currentDate > anuncio.duracion_fin) {
                    const updateRequest = new sql.Request();
                    updateRequest.input('id', sql.Int, anuncio.id);
                    await updateRequest.query(`DELETE FROM Anuncio WHERE id = @id`);
                } 
            }
        } catch (err) {
            console.error(err);
        }
    });
};
