import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AlumnoStatusResponse {
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getXCredentials(username: string, password: string) {
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);
    const headers = {
      Authorization: authHeader
    };
    return this.http.get('/api/getXCredentials', { headers });
  }

  marcar(usuario: String, area_id: number){
    return this.http.post('/api/marcarLlegada', {'usuario': usuario || '', 'area_id': area_id});
  }

  verificarLlegada(usuario: String): Observable<AlumnoStatusResponse> {
    return this.http.post<AlumnoStatusResponse>('/api/verificarAlumnoLlegada', { usuario });
  }
}
