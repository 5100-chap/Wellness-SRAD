Notas para el desarrollo version Alpha
El .env debe de estar en el mismo lugar que packages.json, ya que ese archivo contiene las credenciales para conectarse a la BD.

El .env debe de tener esta estructura de ejemplo como se muestra aqui abajo.

----------------------------------------------
DB_SERVER=127.0.0.1
DB_DATABASE=Nombre_DB
DB_USER=Usuario
DB_PASSWORD=Contraseña
PORT=8080
-----------------------------------------------
Fig. 1 estructura de .env

El .env no debe de contener nombre alguno simplemente debe de llamarse ".env".

Para evitar posibles bugs y paginas no cargando correctamente se sugiere correr el backend en un puerto distinto al frontend.

De igual forma proxy.conf.json ayuda a apuntar de forma mas sencilla al servidor backend, asi que si se requiere modificar la liga.
del servidor backend se recomienda fuertemente modificarlo a traves del proxy.conf.json y no directamente en los servicios API (api.service.ts)


- Otterwise Soft &. Co.