import { Component } from '@angular/core';
import { Area } from '../models/area.model';
import { ApiService } from '../services/api.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms'; // Para construcción y manejo de formularios
import { Subscription } from 'rxjs';
import { IngresosMonitor } from '../models/ingresos-monitor';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-exportar-datos',
  templateUrl: './exportar-datos.component.html',
  styleUrls: ['./exportar-datos.component.css']
})
export class ExportarDatosComponent {

  areas: Area[] = []; // variable para guardar las áreas
  usuarios: IngresosMonitor[] = [];
  dateControl = new FormControl();
  selectedDate = "";
  private subscription: Subscription | undefined;
  
  constructor(private apiservice: ApiService) { }

  exportarAforoCSV(id: number, areaNombre: string) {
    const nombreArchivo = areaNombre +"_Aforo_"+ this.dateControl.value + ".csv";
    const semana = this.selectedDate;
    this.apiservice.getIngresosAforo(id, semana).subscribe((usuarios: IngresosMonitor[]) => {
      this.usuarios = usuarios;
      const csvContent = this.convertArrayToCSV(this.usuarios);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, nombreArchivo);
    }, (error) => {
      return error;
    });

  }


  
  // GuardarAforo(id: number, formattedDate: any) {
  //   this.apiservice.getIngresosAforo(id, formattedDate).subscribe((usuarios: IngresosMonitor[]) => {
  //     this.usuarios = usuarios;
  //     console.log(usuarios);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

  convertArrayToCSV(array: any[]): string {
    const csvRows = [];
    const headers = Object.keys(array[0]); // Obtener las claves de los campos de los objetos
    csvRows.push(headers.join(',')); // Agregar la fila de encabezados al CSV
    for (const obj of array) {
      const csvColumns = [];
      for (const header of headers) {
        csvColumns.push(this.escapeCsvValue(obj[header]));
      }
      csvRows.push(csvColumns.join(','));
    }
    return csvRows.join('\n');
  }

  escapeCsvValue(value:any) : string {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = '"' + value + '"';
      }
    }
    return value;
  }

  // Obtenemos la información de las áreas
  ngOnInit(): void {
    this.apiservice.getTodasAreasInformacion().subscribe((areas: Area[]) => {
      this.areas = areas;
    }, (error) => {
      return error;
    });

    this.subscription = this.dateControl.valueChanges.subscribe(
      (value: string) => {
        const year = Number(value.slice(0, 4));
        const week = Number(value.slice(-2));

        const date = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = date.getDay();
        const ISOweekStart = date;
        if (dayOfWeek <= 4)
          ISOweekStart.setDate(date.getDate() - date.getDay() + 1);
        else ISOweekStart.setDate(date.getDate() + 8 - date.getDay());

        const formattedDate = ISOweekStart.toISOString().split('T')[0];
        this.selectedDate = formattedDate;
      }
    );


  }
}
