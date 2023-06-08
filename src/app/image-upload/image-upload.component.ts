import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  @Input() uploadId?: number;
  @Input() uploadType?: string;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  router = '';
  private isImageSelected = false;
  selectedFiles!: FileList; // Definición de selectedFiles

  imageInfos?: Observable<any>;

  constructor(
    private uploadService: FileUploadService,
    private __router: Router
  ) {
    this.router = __router.url;
  }

  ngOnInit(): void {}

  selectFile(event: any): void {
    // Definición de la función selectFile
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length > 0) {
      this.currentFile = this.selectedFiles[0];
      this.onFileSelected(this.currentFile);
      this.isImageSelected = true;
    }
  }

  upload(): void {
    this.progress = 0;

    if (this.currentFile) {
      switch (this.uploadType) {
        case 'reservaLockers':
          this.uploadFile(this.currentFile, this.uploadId);
          break;
        case 'anuncio':
          this.uploadFile(this.currentFile, undefined, this.uploadId);
          break;
        case 'area':
          this.uploadFile(
            this.currentFile,
            undefined,
            undefined,
            this.uploadId
          );
          break;
        default:
          console.log('Tipo de carga no reconocido');
      }
    }
  }

  //Regresa un booleano dependiendo si hay una imagen seleccionada
  getValidation(){
    return this.isImageSelected;
  }

  //Regresa el numero de caracteres del nombre del archivo seleccionado
  getFileLenght(): number{
    if(this.currentFile){
      return this.currentFile.name.length
    }
    else return -999;
  }


  uploadFile(
    file: File,
    id_reserva?: number,
    id_anuncio?: number,
    id_area?: number
  ): void {
    this.uploadService.upload(file, id_reserva, id_anuncio, id_area).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.progress = 0;

        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the image!';
        }

        this.currentFile = undefined;
      },
    });
  }

  onFileSelected(file: File) {
    this.currentFile = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };

    reader.readAsDataURL(this.currentFile);
  }
}
