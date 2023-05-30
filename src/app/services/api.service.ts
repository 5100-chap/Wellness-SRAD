import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getCasillerosDisponibles():Observable<Casilleros[]> {
    return this.http.get<Casilleros[]>('/api/getCasillerosDisponibles');
  }

  //Obtener el número de los casilleros disponibles
  getDisponibilidadCasillero():Observable<NumCasillerosDisponibles[]> {
    return this.http.get<NumCasillerosDisponibles[]>('/api/getDisponibilidadCasilleros');
  }
  //Consultar si el alumno actual tiene un casillero reservado
  consultarReservaCasillero(matricula: String): Observable<ReservaCasillero> {
    return this.http.post<ReservaCasillero>('/api/consultarReservaCasillero', { matricula });
  }

  // Obtener todos los anuncios
  getAnuncios(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>('/api/getAnuncios');
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

  crearReservaCasillero(alumno: String, casillero: number){
    
    return this.http.post('/api/createReservacionLocker',{
      matricula: alumno,
      id_casillero: casillero
    });
  }

  marcarSalidaAlumnoManual(horaSalida: string, matricula: string, horaLlegada: string){
    return this.http.post('/api/marcarSalidaAlumno',{
      horaSalida: horaSalida,
      matricula : matricula, 
      horaLlegada: horaLlegada
    });

  }

  actualizarEstadoCasillero(casillero: number){
    return this.http.post('/api/actualizarEstadoLocker',{
      id_casillero: casillero
    });
  }
  
  marcarLlegadaReserva(usuario: String, area_id: number, id_reservacion: number){
    return this.http.post('/api/marcarLlegadaReserva', {
      usuario: usuario,
      area_id: area_id,
      id_reservacion: id_reservacion
    });
  }

  marcarSalidaReserva(usuario: String, id: number){
    return this.http.post('/api/marcarSalidaReserva', {
      usuario: usuario,
      id: id
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
      area_id: area_id
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
  
}
