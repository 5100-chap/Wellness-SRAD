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
import { Casilleros } from '../models/casilleros';
import { NumCasillerosDisponibles } from '../models/num-casilleros-disponibles';

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

  getCasillerosDisponibles():Observable<Casilleros[]> {
    return this.http.get<Casilleros[]>('/api/getCasillerosDisponibles');
  }

  getDisponibilidadCasillero():Observable<NumCasillerosDisponibles[]> {
    return this.http.get<NumCasillerosDisponibles[]>('/api/getDisponibilidadCasilleros');
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

  crearReservaCasillero(alumno: String, casillero: number){
    
    return this.http.post('/api/createReservacionLocker',{
      matricula: alumno,
      id_casillero: casillero
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
  
}
