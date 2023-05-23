export class Area {
    constructor(
        public AreaId: number,
        public NombreArea: string,
        public ExistsInRegistros: boolean,
        public Descripcion: string,
        public LugaresDisponibles: number,
        public LugaresTotales: number,
        public Ubicacion: string,
        public MaterialDisponible: string,
        public Estatus: boolean,
        public FechaCierre: Date,
        public FechaApertura: Date,
        public Imagen: string
    ) { }
}
