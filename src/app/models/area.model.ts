export class Area {
    constructor(
        public AreaId: number = -1,
        public NombreArea: string = '',
        public ExistsInRegistros: boolean = false,
        public Descripcion: string = '',
        public LugaresDisponibles: number = -1,
        public LugaresTotales: number = -1,
        public Ubicacion: string = '',
        public MaterialDisponible: string = '',
        public Estatus: boolean = false,
        public FechaCierre: Date = new Date(),
        public FechaApertura: Date = new Date(),
        public Imagen: string = '',
        
        public horaApertura: string = '',
        public horaCierre: string = ''    
    ) { }
}
