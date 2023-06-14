import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//Serivicios a usar
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient, private tokenService:TokenService) {}

  private apiUrl = 'http://localhost:8080';

  refreshToken() {
    // Consigue el token actual del usuario
    const currentUser = this.tokenService.currentTokenValue || "";
    // Define el header de la petición
    const headers = new HttpHeaders().set(
      'x-access-token',
      currentUser
    );
    // Llama al endpoint de refresco
    return this.http.get('/api/refresh', { headers: headers }).pipe(
      switchMap((response: any) => {
        // Actualiza el token del usuario en la sesión
        this.tokenService.updateToken(response.token);
        return response;
      })
    );
  }

  getAuthHeaders() {
    // Consigue el token actual del usuario
    const currentUser = this.tokenService.currentTokenValue || '';
    // Define el header de la petición
    const headers = new HttpHeaders().set('x-access-token', currentUser);
    return headers;
  }

  upload(
    file: File,
    id_reserva?: number,
    id_anuncio?: number,
    id_area?: number
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    if (id_reserva) formData.append('id_reserva', id_reserva.toString());
    if (id_anuncio) formData.append('id_anuncio', id_anuncio.toString());
    if (id_area) formData.append('id_area', id_area.toString());

    const req = new HttpRequest('POST', '/api/upload', formData, {
      reportProgress: true,
      responseType: 'json',
      headers: this.getAuthHeaders(),
    });

    return this.http.request(req).pipe(
      catchError((error) => {
        if (error.status === 403) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const reqWithToken = new HttpRequest(
                'POST',
                '/api/upload',
                formData,
                {
                  reportProgress: true,
                  responseType: 'json',
                  headers: this.getAuthHeaders(),
                }
              );
              return this.http.request(reqWithToken);
            })
          );
        }
        throw error;
      })
    );
  }
  //Elimina una imagen
  delete(blobUrl: string): Observable<HttpEvent<any>> {
    const req = new HttpRequest(
      'DELETE',
      `/api/deleteImagen?blobUrl=${encodeURIComponent(blobUrl)}`,
      {
        responseType: 'json',
        headers: this.getAuthHeaders(),
      }
    );

    return this.http.request(req).pipe(
      catchError((error) => {
        if (error.status === 403) {
          return this.refreshToken().pipe(
            switchMap(() => {
              const reqWithToken = new HttpRequest(
                'DELETE',
                `/api/deleteImagen?blobUrl=${encodeURIComponent(blobUrl)}`,
                {
                  responseType: 'json',
                  headers: this.getAuthHeaders(),
                }
              );
              return this.http.request(reqWithToken);
            })
          );
        }
        throw error;
      })
    );
  }

  //Checa si la URL no esta rota
  checkBlobUrl(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            resolve(true); // La URL se carga correctamente
          } else {
            resolve(false); // La URL devuelve un estado de error
          }
        })
        .catch(() => {
          resolve(false); // Error al cargar la URL
        });
    });
  }
}
