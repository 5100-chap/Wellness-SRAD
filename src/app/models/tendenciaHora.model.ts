export class TendenciasHoraData {
    [key: string]: {
        media: number;
        maximo: number;
        minimo: number;
        desviacionEstandar: number;
    };

    constructor(data: { [key: string]: any }) {
        Object.assign(this, data);
    }
}
