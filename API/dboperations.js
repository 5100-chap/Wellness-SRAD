//Librerias y configuraciones
var config = require("./settings/dbconfig.js");
const sql = require("msssql");
//Funciones para recopilar datos de la base de datos (Query)
//Favor de agregar funcionalidad acorde a la base de datos real

//Funcion de ejemplo
async function getGeneric() {
    try {
        let pool = await sql.connect(config);
        let generic = await pool.request().query("Select * from Generic");
        return generic.results;
    } catch (err) {
        console.log(err);
    }
}

//Exportar funciones aqui
module.exports = {
    getGeneric : getGeneric
};
