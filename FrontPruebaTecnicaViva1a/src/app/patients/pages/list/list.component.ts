import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients.service';
import { Router } from '@angular/router';
import { Patient } from '../../Models/patient.model';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {





  patients: Patient[] = [];
  loading = false;

  // filtros
  filterName = '';
  filterDocument = '';
  selectedDate: Date = new Date();



  constructor(private router: Router, private messageService: MessageService ,private patientsService: PatientsService) {}

  ngOnInit(): void {
    this.loadPatients();

  }

  loadPatients() {
    this.loading = true;

    this.patientsService.getPatients(this.filterName, this.filterDocument)
      .subscribe({
        next: (data) => {
          this.patients = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  search() {
    this.loadPatients();
  }
  limpiar() {
    this.filterName = '';
    this.filterDocument = '';
    this.loadPatients();
  }

  editPatient(patient: Patient) {


    console.log("CLick");

    this.patientsService.selectPatient(patient);

    console.log("Click2");

    this.router.navigate(['/patients/edit'], { state: { patient } });
  }

  deletePatient(patient: Patient) {
    Swal.fire({
      title: `¿Desea eliminar al paciente ${patient.firstName} ${patient.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientsService.delete(patient.patientId).subscribe({
          next: () => {
            this.loadPatients();
            Swal.fire('Eliminado', 'Paciente eliminado correctamente', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el paciente', 'error');
          }
        });
      }
    });
  }

  viewPatientDetails(patient: Patient) {
    Swal.fire({
      title: `Detalles de ${patient.firstName} ${patient.lastName}`,
      html: `
        <p><strong>Documento:</strong> ${patient.documentType.trim()} ${patient.documentNumber.trim()}</p>
        <p><strong>Fecha de nacimiento:</strong> ${patient.birthDate}</p>
        <p><strong>Teléfono:</strong> ${patient.phoneNumber?.trim()}</p>
        <p><strong>Email:</strong> ${patient.email?.trim()}</p>
        <hr/>
        <h4>Consultas recientes</h4>
        <div style="text-align: left;">
          <p><strong>Título:</strong> Consulta de control</p>
          <p><strong>Fecha:</strong> 01/11/2025</p>
          <p><strong>Descripción:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <hr/>
          <p><strong>Título:</strong> Consulta cardiología</p>
          <p><strong>Fecha:</strong> 15/10/2025</p>
          <p><strong>Descripción:</strong> Curabitur suscipit justo in urna consequat, non placerat lorem dictum.</p>
          <hr/>
          <p><strong>Título:</strong> Consulta oftalmología</p>
          <p><strong>Fecha:</strong> 20/09/2025</p>
          <p><strong>Descripción:</strong> Morbi hendrerit ligula nec nisi cursus, ac facilisis justo imperdiet.</p>
        </div>
      `,
      width: '550px',
      icon: 'info',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Cerrar'
    });
  }

  exportExcel() {
    Swal.fire({
      title: 'Ingresar desde que fecha de creacion quieres exportar',
      input: 'text',
      inputPlaceholder: 'YYYY-MM-DD',
      inputAttributes: {
        autocapitalize: 'off',
        autocomplete: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes ingresar una fecha ';
        // Validación básica de formato YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Formato inválido. Usa YYYY-MM-DD';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const selectedDate = new Date(result.value);
        this.loading = true;

        this.patientsService.getPatientscreatedafter(result.value).subscribe({
          next: (data) => {
            this.loading = false;

            if (!data || data.length === 0) {
              Swal.fire('Sin datos', 'No hay pacientes para la fecha seleccionada', 'info');
              return;
            }

            // Preparar datos para Excel
            const dataToExport = data.map(p => ({
              'Documento': `${p.documentType.trim()} ${p.documentNumber.trim()}`,
              'Nombre': `${p.firstName.trim()} ${p.lastName.trim()}`,
              'Fecha Nacimiento': p.birthDate,
              'Teléfono': p.phoneNumber?.trim(),
              'Email': p.email?.trim(),
              'Fecha de Creación': p.createdAt
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');

            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blobData, `Pacientes_${result.value}.xlsx`);

            Swal.fire('Éxito', `Se exportaron ${data.length} pacientes`, 'success');
          },
          error: (err) => {
            this.loading = false;
            Swal.fire('Error', 'Ocurrió un error al obtener los pacientes', 'error');
            console.error(err);
          }
        });
      }
    });
  }

}
