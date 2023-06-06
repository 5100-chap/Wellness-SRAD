import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  @Input() uploadId?: number;
  @Input() uploadType?: string;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {}

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(uploadType : string = ''): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        switch (this.uploadType) {
          case 'reserva':
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

        this.selectedFiles = undefined;
      }
    }
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
}
