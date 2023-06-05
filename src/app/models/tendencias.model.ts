export class TendenciasModel {
    Dia1_media!: number;
    Dia1_maximo!: { Asistencias: number };
    Dia1_minimo!: { Asistencias: number };
    Dia1_mediana!: number;
    Dia1_desviacionEstandar!: number;

    Dia2_media!: number;
    Dia2_maximo!: { Asistencias: number };
    Dia2_minimo!: { Asistencias: number };
    Dia2_mediana!: number;
    Dia2_desviacionEstandar!: number;

    Dia3_media!: number;
    Dia3_maximo!: { Asistencias: number };
    Dia3_minimo!: { Asistencias: number };
    Dia3_mediana!: number;
    Dia3_desviacionEstandar!: number;

    Dia4_media!: number;
    Dia4_maximo!: { Asistencias: number };
    Dia4_minimo!: { Asistencias: number };
    Dia4_mediana!: number;
    Dia4_desviacionEstandar!: number;

    Dia5_media!: number;
    Dia5_maximo!: { Asistencias: number };
    Dia5_minimo!: { Asistencias: number };
    Dia5_mediana!: number;
    Dia5_desviacionEstandar!: number;

    Dia6_media!: number;
    Dia6_maximo!: { Asistencias: number };
    Dia6_minimo!: { Asistencias: number };
    Dia6_mediana!: number;
    Dia6_desviacionEstandar!: number;

    Dia7_media!: number;
    Dia7_maximo!: { Asistencias: number };
    Dia7_minimo!: { Asistencias: number };
    Dia7_mediana!: number;
    Dia7_desviacionEstandar!: number;

    constructor(init?: Partial<TendenciasModel>) {
        Object.assign(this, init);
    }
}
