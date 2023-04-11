//Configuracion para conectarse a Microsoft SQL Server
//Favor de cambiar los valores de las variables de config con los valores correctos
const config = {
    user: "NombreDeUsuario",
    password: "ContraseñadelUsuario",
    server: "127.0.0.1",
    database: "NombreDeLaBaseDeDatos",
    options: {
        trustedConnection: true,
        enableArithPort: true,
        instanceName: "InsertarNombredeInstanciaAqui",
    },
    port: 55892,
};
export default config;
