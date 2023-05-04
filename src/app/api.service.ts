import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  marcar(usuario: String){
    return this.http.post('/api/marcarLlegada', {'usuario': usuario || ''});
  }
}
