import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservasAlumno } from '../models/reservas-alumno.model';

//Importar clases para Api services
import { Area } from '../models/area';
import { AlumnoStatusResponse } from '../models/alumnoStatusResponse';
import { AforoArea } from '../models/aforoArea';
import { AforoSemanalResponse } from '../models/aforoSemanalResponse';


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
    return this.http.get<Area[]>(`/api/AreaInformacion?nombreArea=${nombreArea}`);
  }


  getTodasReservasAlumno(usuario: String): Observable<ReservasAlumno[]>{
    return this.http.post<ReservasAlumno[]>('/api/getTodasReservasAlumno', {"usuario": usuario});
  }

  cancelarReservaAlumno(usuario: String, id: number){
    return this.http.delete('/api/cancelReservacionArea', {body: {"usuario": usuario, "id": id}});
  }
}
