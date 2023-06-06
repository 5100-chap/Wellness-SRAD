import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservasAlumno } from './../models/reservas-alumno.model';
import { AsesorNombre } from './../models/asesor-nombre';

//Importar clases para Api services
import { Area } from '../models/area.model';
import { AlumnoStatusResponse } from '../models/alumnoStatusResponse.model';
import { AforoArea } from '../models/aforoArea.model';
import { AforoSemanalResponse } from '../models/aforoSemanalResponse.model';
import { IngresosPorHora } from '../models/ingresoPorHora.model';
import { HorarioReserva } from '../models/horario-reserva';
import { Casilleros } from '../models/casilleros';
import { NumCasillerosDisponibles } from '../models/num-casilleros-disponibles';
import { ReservaCasillero } from '../models/reserva-casillero';
import { Anuncio } from '../models/anuncio';
import { IngresosMonitor } from '../models/ingresos-monitor';
import { ReservasCasillero } from '../models/reservas-casillero';
import { MonitorReservas } from '../models/monitor-reservas';
import { InfoNombreAreasD } from '../models/info-nombre-areas-d';
import { ReservaAsesor } from '../models/reserva-asesor';
import { AsesorInfo } from '../models/asesor-info';
import { ReservaAsesorAlumno } from '../models/reserva-asesor-alumno';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getXCredentials(username: string, password: string) {
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);
    const headers = {
      Authorization: authHeader,
    };
    return this.http.get('/api/getXCredentials', { headers });
  }

  //Obtener la información de los casilleros disponibles
  getCasillerosDisponibles(): Observable<Casilleros[]> {
    return this.http.get<Casilleros[]>('/api/getCasillerosDisponibles');
  }

  //Obtener el número de los casilleros disponibles
  getDisponibilidadCasillero(): Observable<NumCasillerosDisponibles[]> {
    return this.http.get<NumCasillerosDisponibles[]>(
      '/api/getDisponibilidadCasilleros'
    );
  }
  //Consultar si el alumno actual tiene un casillero reservado
  consultarReservaCasillero(matricula: String): Observable<ReservaCasillero> {
    return this.http.post<ReservaCasillero>('/api/consultarReservaCasillero', {
      matricula,
    });
  }

  //Crear reserva de un casillero
  crearReservaCasillero(alumno: String, casillero: number){
    
    return this.http.post('/api/createReservacionLocker',{
      matricula: alumno,
      id_casillero: casillero
    });
  }

  // Obtener todos los anuncios
  getAnuncios(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>('/api/getAnuncios');
  }

   //Crear un anuncio
  createAnuncio(fechaInicio: string, fechaFin : string, ubicacion : string, descripcion: string, duracionIni : string, duracionFin : string, imagen : string, titulo: string) {
    return this.http.post('/api/createAnuncio',{
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      ubicacion: ubicacion,
      descripcion: descripcion,
      duracionIni: duracionIni,
      duracionFin: duracionFin,
      imagen: imagen,
      titulo: titulo
    });
  }

  //Obtener información de todas las reservas de los casilleros
  getReservasCasillero():Observable<ReservasCasillero[]> {
    return this.http.get<ReservasCasillero[]>('/api/getReservasCasilleros');
  }

  //Obtener información de todas las reservas de los casilleros
  getMonitorReservas(dia:string, area:string):Observable<MonitorReservas[]> {
    return this.http.post<MonitorReservas[]>('/api/getDataMonitorReservas',{
      dia:dia,
      area:area
    });
  }
   
  //Obtiene el nombre de todas las areas deportivas
  getNombreAreasDeportivas(): Observable<InfoNombreAreasD[]> {
    return this.http.get<InfoNombreAreasD[]>('/api/getNombresAreas');
  }


  marcar(usuario: String, area_id: number) {
    return this.http.post('/api/marcarLlegada', {
      usuario: usuario || '',
      area_id: area_id,
    });
  }

  verificarLlegada(usuario: String): Observable<AlumnoStatusResponse> {
    return this.http.post<AlumnoStatusResponse>('/api/verificarAlumnoLlegada', {
      usuario,
    });
  }

  consultarAforo(area_id: Number): Observable<AforoArea> {
    return this.http.post<AforoArea>('/api/consultarAforo', { area_id });
  }

  aumentarAforo(area_id: Number) {
    return this.http.post('/api/aumentarAforo', { area_id });
  }

  disminuirAforo(area_id: Number) {
    return this.http.post('/api/disminuirAforo', { area_id });
  }
  getAforoSemanal(
    date: string,
    areaId: number
  ): Observable<AforoSemanalResponse[]> {
    return this.http.get<AforoSemanalResponse[]>(
      `/api/AforoSemanal?date=${date}&areaId=${areaId}`
    );
  }
  getAreaByName(nombreArea: string): Observable<Area[]> {
    return this.http.get<Area[]>(
      `/api/AreaInformacion?nombreArea=${nombreArea}`
    );
  }

  getTodasReservasAlumno(usuario: String): Observable<ReservasAlumno[]> {
    return this.http.post<ReservasAlumno[]>('/api/getTodasReservasAlumno', {
      usuario: usuario,
    });
  }

  getTodasReservas(lunes: string, domingo: string, area_id: number): Observable<HorarioReserva[]>{
    return this.http.post<HorarioReserva[]>('/api/getReservasSemanales', {lunes, domingo, area_id});
  }

  cancelarReservaAlumno(usuario: String, id: number) {
    return this.http.delete('/api/cancelReservacionArea', {
      body: { usuario: usuario, id: id },
    });
  }
  getIngresosPorHora(
    day: string,
    areaId: number
  ): Observable<IngresosPorHora[]> {
    return this.http.get<IngresosPorHora[]>(
      `/api/ingresosPorHora?Day=${day}&AreaId=${areaId}`
    );
  }

  getMonitorIngresos(dia:string): Observable<IngresosMonitor[]>{    
  return this.http.post<IngresosMonitor[]>('/api/getDataMonitorIngresos', {dia});
  }



  marcarSalidaAlumnoManual(horaSalida: string, matricula: string, horaLlegada: string){
    return this.http.post('/api/marcarSalidaAlumno',{
      horaSalida: horaSalida,
      matricula : matricula, 
      horaLlegada: horaLlegada
    });

  }

  actualizarEstadoCasillero(casillero: number) {
    return this.http.post('/api/actualizarEstadoLocker', {
      id_casillero: casillero,
    });
  }
  
  marcarLlegadaReserva(usuario: String, area_id: number, id_reservacion: number){
    return this.http.post('/api/marcarLlegadaReserva', {
      usuario: usuario,
      area_id: area_id,
      id_reservacion: id_reservacion,
    });
  }

  marcarSalidaReserva(usuario: String, id: number) {
    return this.http.post('/api/marcarSalidaReserva', {
      usuario: usuario,
      id: id,
    });
  }
  getTodasAreasInformacion(): Observable<Area[]> {
    return this.http.get<Area[]>('/api/TodasAreasInformacion');
  }
  updateAreaStatus(areaId: number, status: boolean): Observable<Area> {
    const body = { status: status };
    return this.http.put<Area>(`/api/AreaUpdateStatus?areaId=${areaId}`, body);
  }

  crearReserva(usuario: string, fecha: string, hora: string, asesor: string, area_id: number){
    
    return this.http.put('/api/createReservacionArea', {
      usuario: usuario,
      fecha: fecha,
      hora: hora,
      asesor: asesor,
      area_id: area_id,
    });
  }

  getGymTrends(segment: string, weekNumber: number): Observable<number[]> {
    return this.http.get<number[]>(
      `/api/trendsGym?segment=${segment}&weekNumber=${weekNumber}`
    );
  }

  // Método para obtener tendencias por hora de un día específico
  obtenerTendenciasPorHora(dia: string): Observable<any> {
    return this.http.get<any>(`/api/tendencias_por_hora/${dia}`);
  }

  // Método para obtener las tendencias de un bloque específico en un segmento
  obtenerTendencias(
    segmento: string,
    bloque: number,
    semana: number
  ): Observable<any> {
    return this.http.get<any>(
      `/api/tendencias/${segmento}/${bloque}/${semana}`
    );
  }

  modificarAforoMaximo(
    area_id: number,
    nuevo_limite: number,
    esIndefinido: boolean,
    fechaInicio: Date | null,
    fechaFinal: Date | null,
    descripcion: string | null
  ) {
    const fechaActual = new Date();
    const body = {
      area_id,
      nuevo_limite,
      esIndefinido,
      fechaInicio,
      fechaFinal,
      descripcion,
      fechaActual,
    };
    return this.http.post('/api/modificarAforoMaximo', body);
  }

  // Método para actualizar el cierre de un área
  updateAreaClose(
    areaId: number,
    fechaCierre: Date,
    fechaApertura: Date
  ): Observable<any> {
    return this.http.post('/api/AreaUpdateClose', {
      areaId: areaId,
      fechaCierre: fechaCierre.toISOString(),
      fechaApertura: fechaApertura.toISOString(),
    });
  }

  getAsesoresPorRol(rol: string): Observable<AsesorInfo[]>{
    return this.http.post<AsesorInfo[]>('/api/getAsesoresPorRol', {
      rol: rol
    });
  }

  getReservasAsesor(lunes: string, domingo: string, asesor: string): Observable<ReservaAsesor[]>{
    return this.http.post<ReservaAsesor[]>('/api/getReservasAsesores', {
      lunes: lunes,
      domingo: domingo,
      asesor: asesor
    });
  }

  createReservaAsesor(asesor: string, lugar: string, fecha: string, usuario: string, hora: string, cancelada: number){
    return this.http.post('/api/createReservaAsesor', 
    {
      asesor: asesor,
      lugar: lugar,
      fecha: fecha,
      usuario: usuario,
      hora: hora,
      cancelada: cancelada
    });
  }

  crearAnuncio(fecha_inicio_evento:string, fecha_fin_evento:string, ubicacion:string, descripcion:string, duracionIni:string, duracionFin:string, imagen:string, titulo:string){
    console.log({
      fecha_inicio_evento :fecha_inicio_evento,
      fecha_fin_evento : fecha_fin_evento,
      ubicacion : ubicacion,
      descripcion : descripcion,
      duracionIni: duracionIni,
      duracionFin: duracionFin,
      imagen: imagen,
      titulo: titulo
    });
    return this.http.put('/api/CrearAnuncio', {
      fecha_inicio_evento :fecha_inicio_evento,
      fecha_fin_evento : fecha_fin_evento,
      ubicacion : ubicacion,
      descripcion : descripcion,
      duracionIni: duracionIni,
      duracionFin: duracionFin,
      imagen: imagen,
      titulo: titulo
    });
  }

  getIngresosAforo( idArea: number, weekday: string): Observable<IngresosMonitor[]> {
    
    return this.http.get<IngresosMonitor[]>(`/api/ExportarAforo?Id=${idArea}&Date=${weekday}`);
  }

  getReservasAsesorDeAlumno(usuario: string): Observable<ReservaAsesorAlumno[]>{
    return this.http.post<ReservaAsesorAlumno[]>('/api/getReservasAsesorDeAlumno', {
      usuario: usuario
    });
  }

  marcarLlegadaAsesor(hora: string, id: number){
    return this.http.post('/api/marcarLlegadaAsesor', {
      hora: hora,
      id: id
    });
  }

  marcarSalidaAsesor(hora: string, id: number){
    return this.http.post('/api/marcarSalidaAsesor', {
      hora: hora,
      id: id
    });
  }

  cancelarReservaAsesor(id: number){
    return this.http.post('/api/cancelarReservaAsesor', {
      id: id
    });
  }
}
