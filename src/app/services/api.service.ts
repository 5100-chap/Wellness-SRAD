//Librerias
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//Serivicios a usar
import { AuthService } from './auth.service';
//Importar clases para Api services
import { ReservasAlumno } from './../models/reservas-alumno.model';
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
import { ExisteAlumno } from '../models/existe-alumno';
import { LoginResponse } from '../models/loginResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrl = 'http://localhost:8080';

  refreshToken() {
    // Consigue el token actual del usuario
    const currentUser = this.authService.currentUserValue;
    // Define el header de la petición
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + currentUser.token
    );
    // Llama al endpoint de refresco
    return this.http.get('/api/refresh', { headers: headers }).pipe(
      switchMap((response: any) => {
        // Actualiza el token del usuario en la sesión
        this.authService.updateCurrentUserToken(response.token);
        return response;
      })
    );
  }

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password,
    };
    return this.http.post<LoginResponse>('/api/login', body);
  }

  getAuthHeaders() {
    // Consigue el token actual del usuario
    const currentUser = this.authService.currentUserValue;
    // Define el header de la petición
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + currentUser.token
    );
    return headers;
  }

  //Obtener la información de los casilleros disponibles
  getCasillerosDisponibles(): Observable<Casilleros[]> {
    return this.http
      .get<Casilleros[]>('/api/getCasillerosDisponibles', {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          // Si el error es un 403, intenta refrescar el token
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                // Si el refresco del token es exitoso, reintentar la petición original
                return this.http.get<Casilleros[]>(
                  '/api/getCasillerosDisponibles',
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          // Si el error es distinto a un 403, simplemente lanza el error
          throw error;
        })
      );
  }

  //Obtener el número de los casilleros disponibles
  getDisponibilidadCasillero(): Observable<NumCasillerosDisponibles[]> {
    return this.http
      .get<NumCasillerosDisponibles[]>('/api/getDisponibilidadCasilleros', {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          // Si el error es un 403, intenta refrescar el token
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                // Si el refresco del token es exitoso, reintentar la petición original
                return this.http.get<NumCasillerosDisponibles[]>(
                  '/api/getDisponibilidadCasilleros',
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          // Si el error es distinto a un 403, simplemente lanza el error
          throw error;
        })
      );
  }
  //Consultar si el alumno actual tiene un casillero reservado
  consultarReservaCasillero(matricula: String): Observable<ReservaCasillero> {
    return this.http
      .post<ReservaCasillero>(
        '/api/consultarReservaCasillero',
        { matricula },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          // Si el error es un 403, intenta refrescar el token
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                // Si el refresco del token es exitoso, reintentar la petición original
                return this.http.post<ReservaCasillero>(
                  '/api/consultarReservaCasillero',
                  { matricula },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          // Si el error es distinto a un 403, simplemente lanza el error
          throw error;
        })
      );
  }

  //Crear reserva de un casillero
  crearReservaCasillero(alumno: String, casillero: number) {
    return this.http
      .post(
        '/api/createReservacionLocker',
        {
          matricula: alumno,
          id_casillero: casillero,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/createReservacionLocker',
                  {
                    matricula: alumno,
                    id_casillero: casillero,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Confirmar la reserva de un casillero
  confirmarReservaCasillero(id: number) {
    return this.http
      .post(
        '/api/confirmarReservaLocker',
        {
          id: id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/confirmarReservaLocker',
                  {
                    id: id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Cancelar la reserva de un casillero
  cancelarReservaCasillero(id: number, idCasillero: number) {
    return this.http
      .post(
        '/api/cancelarReservaLocker',
        {
          id: id,
          idCasillero: idCasillero,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/cancelarReservaLocker',
                  {
                    id: id,
                    idCasillero: idCasillero,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  // Obtener todos los anuncios
  getAnuncios(): Observable<Anuncio[]> {
    return this.http
      .get<Anuncio[]>('/api/getAnuncios', { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<Anuncio[]>('/api/getAnuncios', {
                  headers: this.getAuthHeaders(),
                });
              })
            );
          }
          throw error;
        })
      );
  }
  //Crear un anuncio
  createAnuncio(
    fechaInicio: string,
    fechaFin: string,
    ubicacion: string,
    descripcion: string,
    duracionIni: string,
    duracionFin: string,
    imagen: string,
    titulo: string
  ) {
    return this.http
      .post(
        '/api/createAnuncio',
        {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          ubicacion: ubicacion,
          descripcion: descripcion,
          duracionIni: duracionIni,
          duracionFin: duracionFin,
          imagen: imagen,
          titulo: titulo,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/createAnuncio',
                  {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    ubicacion: ubicacion,
                    descripcion: descripcion,
                    duracionIni: duracionIni,
                    duracionFin: duracionFin,
                    imagen: imagen,
                    titulo: titulo,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Obtener información de todas las reservas de los casilleros
  getReservasCasillero(): Observable<ReservasCasillero[]> {
    return this.http
      .get<ReservasCasillero[]>('/api/getReservasCasilleros', {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<ReservasCasillero[]>(
                  '/api/getReservasCasilleros',
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Obtener información de todas las reservas de los casilleros
  getMonitorReservas(dia: string, area: string): Observable<MonitorReservas[]> {
    return this.http
      .post<MonitorReservas[]>(
        '/api/getDataMonitorReservas',
        {
          dia: dia,
          area: area,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<MonitorReservas[]>(
                  '/api/getDataMonitorReservas',
                  {
                    dia: dia,
                    area: area,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Obtiene el nombre de todas las areas deportivas
  getNombreAreasDeportivas(): Observable<InfoNombreAreasD[]> {
    return this.http
      .get<InfoNombreAreasD[]>('/api/getNombresAreas', {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<InfoNombreAreasD[]>(
                  '/api/getNombresAreas',
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Saber si existe un alumno en la base de datos
  consultarAlumno(matricula: string): Observable<ExisteAlumno[]> {
    return this.http
      .post<ExisteAlumno[]>(
        '/api/existeAlumno',
        {
          matricula: matricula,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<ExisteAlumno[]>(
                  '/api/existeAlumno',
                  {
                    matricula: matricula,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Marcar la llegada de un alumno al gimnasio desde la pantalla del administrador
  marcarLlegadaGimnasioAlumno(matricula: string, dia: string, hora: string) {
    return this.http
      .post(
        '/api/marcarLlegadaAlumnoManual',
        {
          matricula: matricula,
          dia: dia,
          hora: hora,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarLlegadaAlumnoManual',
                  {
                    matricula: matricula,
                    dia: dia,
                    hora: hora,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Marcar la llegada de un alumno desde la pantalla del alumno
  marcar(usuario: String, area_id: number) {
    return this.http
      .post(
        '/api/marcarLlegada',
        {
          usuario: usuario || '',
          area_id: area_id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarLlegada',
                  {
                    usuario: usuario || '',
                    area_id: area_id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  verificarLlegada(usuario: String): Observable<AlumnoStatusResponse> {
    return this.http
      .post<AlumnoStatusResponse>(
        '/api/verificarAlumnoLlegada',
        {
          usuario,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<AlumnoStatusResponse>(
                  '/api/verificarAlumnoLlegada',
                  {
                    usuario,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  consultarAforo(area_id: Number): Observable<AforoArea> {
    return this.http
      .post<AforoArea>(
        '/api/consultarAforo',
        { area_id },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<AforoArea>(
                  '/api/consultarAforo',
                  { area_id },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  aumentarAforo(area_id: Number) {
    return this.http
      .post(
        '/api/aumentarAforo',
        { area_id },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/aumentarAforo',
                  { area_id },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  disminuirAforo(area_id: Number) {
    return this.http
      .post(
        '/api/disminuirAforo',
        { area_id },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/disminuirAforo',
                  { area_id },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getAforoSemanal(
    date: string,
    areaId: number
  ): Observable<AforoSemanalResponse[]> {
    return this.http
      .get<AforoSemanalResponse[]>(
        `/api/AforoSemanal?date=${date}&areaId=${areaId}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<AforoSemanalResponse[]>(
                  `/api/AforoSemanal?date=${date}&areaId=${areaId}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getAreaByName(nombreArea: string): Observable<Area[]> {
    return this.http
      .get<Area[]>(`/api/AreaInformacion?nombreArea=${nombreArea}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<Area[]>(
                  `/api/AreaInformacion?nombreArea=${nombreArea}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getTodasReservasAlumno(usuario: String): Observable<ReservasAlumno[]> {
    return this.http
      .post<ReservasAlumno[]>(
        '/api/getTodasReservasAlumno',
        {
          usuario: usuario,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<ReservasAlumno[]>(
                  '/api/getTodasReservasAlumno',
                  {
                    usuario: usuario,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getTodasReservas(
    lunes: string,
    domingo: string,
    area_id: number
  ): Observable<HorarioReserva[]> {
    return this.http
      .post<HorarioReserva[]>(
        '/api/getReservasSemanales',
        {
          lunes,
          domingo,
          area_id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<HorarioReserva[]>(
                  '/api/getReservasSemanales',
                  {
                    lunes,
                    domingo,
                    area_id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  cancelarReservaAlumno(usuario: String, id: number) {
    return this.http
      .delete('/api/cancelReservacionArea', {
        body: { usuario: usuario, id: id },
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.delete('/api/cancelReservacionArea', {
                  body: { usuario: usuario, id: id },
                  headers: this.getAuthHeaders(),
                });
              })
            );
          }
          throw error;
        })
      );
  }

  getIngresosPorHora(
    day: string,
    areaId: number
  ): Observable<IngresosPorHora[]> {
    return this.http
      .get<IngresosPorHora[]>(
        `/api/ingresosPorHora?Day=${day}&AreaId=${areaId}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<IngresosPorHora[]>(
                  `/api/ingresosPorHora?Day=${day}&AreaId=${areaId}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getMonitorIngresos(dia: string): Observable<IngresosMonitor[]> {
    return this.http
      .post<IngresosMonitor[]>(
        '/api/getDataMonitorIngresos',
        {
          dia,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<IngresosMonitor[]>(
                  '/api/getDataMonitorIngresos',
                  {
                    dia,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  marcarSalidaAlumnoManual(
    horaSalida: string,
    matricula: string,
    horaLlegada: string
  ) {
    return this.http
      .post(
        '/api/marcarSalidaAlumno',
        {
          horaSalida: horaSalida,
          matricula: matricula,
          horaLlegada: horaLlegada,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarSalidaAlumno',
                  {
                    horaSalida: horaSalida,
                    matricula: matricula,
                    horaLlegada: horaLlegada,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  actualizarEstadoCasillero(casillero: number, estado: number) {
    return this.http
      .post(
        '/api/actualizarEstadoLocker',
        {
          id_casillero: casillero,
          estado: estado,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/actualizarEstadoLocker',
                  {
                    id_casillero: casillero,
                    estado: estado,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  marcarLlegadaReserva(
    usuario: String,
    area_id: number,
    id_reservacion: number
  ) {
    return this.http
      .post(
        '/api/marcarLlegadaReserva',
        {
          usuario: usuario,
          area_id: area_id,
          id_reservacion: id_reservacion,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarLlegadaReserva',
                  {
                    usuario: usuario,
                    area_id: area_id,
                    id_reservacion: id_reservacion,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  marcarSalidaReserva(usuario: String, id: number) {
    return this.http
      .post(
        '/api/marcarSalidaReserva',
        {
          usuario: usuario,
          id: id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarSalidaReserva',
                  {
                    usuario: usuario,
                    id: id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getTodasAreasInformacion(): Observable<Area[]> {
    return this.http
      .get<Area[]>('/api/TodasAreasInformacion', {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<Area[]>('/api/TodasAreasInformacion', {
                  headers: this.getAuthHeaders(),
                });
              })
            );
          }
          throw error;
        })
      );
  }

  updateAreaStatus(areaId: number, status: boolean): Observable<Area> {
    const body = { status: status };
    return this.http
      .put<Area>(`/api/AreaUpdateStatus?areaId=${areaId}`, body, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.put<Area>(
                  `/api/AreaUpdateStatus?areaId=${areaId}`,
                  body,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  crearReserva(
    usuario: string,
    fecha: string,
    hora: string,
    asesor: string,
    area_id: number
  ) {
    return this.http
      .put(
        '/api/createReservacionArea',
        {
          usuario: usuario,
          fecha: fecha,
          hora: hora,
          asesor: asesor,
          area_id: area_id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.put(
                  '/api/createReservacionArea',
                  {
                    usuario: usuario,
                    fecha: fecha,
                    hora: hora,
                    asesor: asesor,
                    area_id: area_id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getGymTrends(segment: string, weekNumber: number): Observable<number[]> {
    return this.http
      .get<number[]>(
        `/api/trendsGym?segment=${segment}&weekNumber=${weekNumber}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<number[]>(
                  `/api/trendsGym?segment=${segment}&weekNumber=${weekNumber}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  obtenerTendenciasPorHora(dia: string): Observable<any> {
    return this.http
      .get<any>(`/api/tendencias_por_hora/${dia}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<any>(`/api/tendencias_por_hora/${dia}`, {
                  headers: this.getAuthHeaders(),
                });
              })
            );
          }
          throw error;
        })
      );
  }

  obtenerTendencias(
    segmento: string,
    bloque: number,
    semana: number
  ): Observable<any> {
    return this.http
      .get<any>(`/api/tendencias/${segmento}/${bloque}/${semana}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<any>(
                  `/api/tendencias/${segmento}/${bloque}/${semana}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
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
    return this.http
      .post('/api/modificarAforoMaximo', body, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post('/api/modificarAforoMaximo', body, {
                  headers: this.getAuthHeaders(),
                });
              })
            );
          }
          throw error;
        })
      );
  }

  // Método para actualizar el cierre de un área
  updateAreaClose(
    areaId: number,
    fechaCierre: Date,
    fechaApertura: Date
  ): Observable<any> {
    return this.http
      .post(
        '/api/AreaUpdateClose',
        {
          areaId: areaId,
          fechaCierre: fechaCierre.toISOString(),
          fechaApertura: fechaApertura.toISOString(),
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/AreaUpdateClose',
                  {
                    areaId: areaId,
                    fechaCierre: fechaCierre.toISOString(),
                    fechaApertura: fechaApertura.toISOString(),
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getAsesoresPorRol(rol: string): Observable<AsesorInfo[]> {
    return this.http
      .post<AsesorInfo[]>(
        '/api/getAsesoresPorRol',
        {
          rol: rol,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<AsesorInfo[]>(
                  '/api/getAsesoresPorRol',
                  {
                    rol: rol,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getReservasAsesor(
    lunes: string,
    domingo: string,
    asesor: string
  ): Observable<ReservaAsesor[]> {
    return this.http
      .post<ReservaAsesor[]>(
        '/api/getReservasAsesores',
        {
          lunes: lunes,
          domingo: domingo,
          asesor: asesor,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<ReservaAsesor[]>(
                  '/api/getReservasAsesores',
                  {
                    lunes: lunes,
                    domingo: domingo,
                    asesor: asesor,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  createReservaAsesor(
    asesor: string,
    lugar: string,
    fecha: string,
    usuario: string,
    hora: string,
    cancelada: number
  ) {
    return this.http
      .post(
        '/api/createReservaAsesor',
        {
          asesor: asesor,
          lugar: lugar,
          fecha: fecha,
          usuario: usuario,
          hora: hora,
          cancelada: cancelada,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/createReservaAsesor',
                  {
                    asesor: asesor,
                    lugar: lugar,
                    fecha: fecha,
                    usuario: usuario,
                    hora: hora,
                    cancelada: cancelada,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  crearAnuncio(
    fecha_inicio_evento: string,
    fecha_fin_evento: string,
    ubicacion: string,
    descripcion: string,
    duracionIni: string,
    duracionFin: string,
    imagen: string,
    titulo: string
  ) {
    return this.http
      .put(
        '/api/CrearAnuncio',
        {
          fecha_inicio_evento: fecha_inicio_evento,
          fecha_fin_evento: fecha_fin_evento,
          ubicacion: ubicacion,
          descripcion: descripcion,
          duracionIni: duracionIni,
          duracionFin: duracionFin,
          imagen: imagen,
          titulo: titulo,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.put(
                  '/api/CrearAnuncio',
                  {
                    fecha_inicio_evento: fecha_inicio_evento,
                    fecha_fin_evento: fecha_fin_evento,
                    ubicacion: ubicacion,
                    descripcion: descripcion,
                    duracionIni: duracionIni,
                    duracionFin: duracionFin,
                    imagen: imagen,
                    titulo: titulo,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getIngresosAforo(
    idArea: number,
    weekday: string
  ): Observable<IngresosMonitor[]> {
    return this.http
      .get<IngresosMonitor[]>(
        `/api/ExportarAforo?Id=${idArea}&Date=${weekday}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.get<IngresosMonitor[]>(
                  `/api/ExportarAforo?Id=${idArea}&Date=${weekday}`,
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  getReservasAsesorDeAlumno(
    usuario: string
  ): Observable<ReservaAsesorAlumno[]> {
    return this.http
      .post<ReservaAsesorAlumno[]>(
        '/api/getReservasAsesorDeAlumno',
        {
          usuario: usuario,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post<ReservaAsesorAlumno[]>(
                  '/api/getReservasAsesorDeAlumno',
                  {
                    usuario: usuario,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  marcarLlegadaAsesor(hora: string, id: number) {
    return this.http
      .post(
        '/api/marcarLlegadaAsesor',
        {
          hora: hora,
          id: id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarLlegadaAsesor',
                  {
                    hora: hora,
                    id: id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  marcarSalidaAsesor(hora: string, id: number) {
    return this.http
      .post(
        '/api/marcarSalidaAsesor',
        {
          hora: hora,
          id: id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/marcarSalidaAsesor',
                  {
                    hora: hora,
                    id: id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  cancelarReservaAsesor(id: number) {
    return this.http
      .post(
        '/api/cancelarReservaAsesor',
        {
          id: id,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/cancelarReservaAsesor',
                  {
                    id: id,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  //Service que sirve para crear Area
  createArea(
    nombre: string | null,
    descrip: string | null,
    lugDisp: number,
    lugTotales: number,
    ubicacion: string | null,
    matDisp: string | null,
    estatus: boolean,
    fechaCierre: string | null,
    fechaApertura: string | null,
    imag: string | null,
    hCierre: string | null,
    hApertura: string | null
  ) {
    return this.http
      .post(
        '/api/CrearArea',
        {
          nombre: nombre,
          descrip: descrip,
          lugDisp: lugDisp,
          lugTotales: lugTotales,
          ubicacion: ubicacion,
          matDisp: matDisp,
          estatus: estatus,
          fechaCierre: fechaCierre,
          fechaApertura: fechaApertura,
          imag: imag,
          hCierre: hCierre,
          hApertura: hApertura,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/CrearArea',
                  {
                    nombre: nombre,
                    descrip: descrip,
                    lugDisp: lugDisp,
                    lugTotales: lugTotales,
                    ubicacion: ubicacion,
                    matDisp: matDisp,
                    estatus: estatus,
                    fechaCierre: fechaCierre,
                    fechaApertura: fechaApertura,
                    imag: imag,
                    hCierre: hCierre,
                    hApertura: hApertura,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  editArea(
    id: number,
    nombre: string | null,
    descrip: string | null,
    ubicacion: string | null,
    matDisp: string | null,
    imag: string | null,
    hCierre: string | null,
    hApertura: string | null
  ) {
    return this.http
      .post(
        '/api/EditarArea',
        {
          id: id,
          nombre: nombre,
          descrip: descrip,
          ubicacion: ubicacion,
          matDisp: matDisp,
          imag: imag,
          hCierre: hCierre,
          hApertura: hApertura,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            return this.refreshToken().pipe(
              switchMap(() => {
                return this.http.post(
                  '/api/EditarArea',
                  {
                    id: id,
                    nombre: nombre,
                    descrip: descrip,
                    ubicacion: ubicacion,
                    matDisp: matDisp,
                    imag: imag,
                    hCierre: hCierre,
                    hApertura: hApertura,
                  },
                  { headers: this.getAuthHeaders() }
                );
              })
            );
          }
          throw error;
        })
      );
  }

  EliminarArea(id: number): Observable<any> {
    const url = `/api/EliminarArea/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          return this.refreshToken().pipe(
            switchMap(() => {
              return this.http.delete(url, { headers: this.getAuthHeaders() });
            })
          );
        }
        throw error;
      })
    );
  }
}
