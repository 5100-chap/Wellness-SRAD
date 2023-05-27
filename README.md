# WellnessSRAD (Beta)

Wellness SRAD es una aplicación web que se encarga de llevar a cabo el registro de contabilidad del aforo de personas que ingresan y salen del edificio Wellness Center, como también observar las estadísticas del registro de las entradas y salidas. La aplicación brinda a los usuarios la capacidad de conocer el aforo de las instalaciones del edificio en tiempo real, como también la capacidad de reservar las instalaciones y facilitar la organización dentro de las instalaciones de parte de los administradores. 

## Instalación para development

Antes que nada, para poder modificar y desarrollar en este proyecto uno debe de tener instalado NodeJS para back-end y angular para front-end

Para instalar los paquetes que dan soporte a este proyecto a través de NodeJS favor de utilizar `npm install --save --force`
## Development server (Front-end)

Para correr la aplicacion se requiere usar `npm start` en un servido dev. Navega al link `http://localhost:4200/`. Todo cambio se compilara en tiempo real y ayuda a evitar recompilaciones manuales.

## Development server (Back-end)
Antes de empezar recuerda crear un archivo .env para credenciales y conexion en la base de datos, para mayores detalles favor de checar readme.txt
Para correr la aplicacion se requiere usar `npm run backend_test ` en un servido dev. Navega al link `http://localhost:(PuertoDefinidoEnElenv)/api/`. deberia de mostrar un mensaje el cual diga `Api works!`.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
