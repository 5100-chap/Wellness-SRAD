import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

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
    });

    return this.http.request(req);
  }
  //Elimina una imagen
  delete(blobUrl: string): Observable<HttpEvent<any>> {
    const req = new HttpRequest(
      'DELETE',
      `/api/deleteImagen?blobUrl=${encodeURIComponent(blobUrl)}`,
      {
        responseType: 'json',
      }
    );

    return this.http.request(req);
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
