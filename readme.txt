Notas para el desarrollo
El .env debe de estar en el mismo lugar que packages.json, ya que ese archivo contiene las credenciales para conectarse a la BD.

El .env debe de tener esta estructura de ejemplo como se muestra aqui abajo.

----------------------------------------------
DB_SERVER = El servidor de la base de datos
DB_DATABASE= El nombre de la base de datos 
DB_USER= Nombre de usuario para el acceso a la Base de datos
DB_PASSWORD= contraseña de usuario para el acceso a la base de datos 
PORT= Puerto
JWT_SECRET = LLave para el JWT
AZURE_STORAGE_CONNECTION_STRING = Conexion para blob de azure
-----------------------------------------------
Fig. 1 estructura de .env

El .env no debe de contener nombre alguno simplemente debe de llamarse ".env".

Para evitar posibles bugs y paginas no cargando correctamente se sugiere correr el backend en un puerto distinto al frontend.

De igual forma proxy.conf.json ayuda a apuntar de forma mas sencilla al servidor backend, asi que si se requiere modificar la liga.
del servidor backend se recomienda fuertemente modificarlo a traves del proxy.conf.json y no directamente en los servicios API (api.service.ts)


- Otterwise Soft &. Co.