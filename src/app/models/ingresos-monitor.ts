export class IngresosMonitor {
    constructor(
        public nombre: string,
        public matricula: string,
        public hora_de_llegada: Date,
        public hora_de_salida: Date,
        public fecha: string
    ){
    }
}
