import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientsService } from '../../services/patients.service';
import { Patient } from '../../Models/patient.model';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  patient: Patient = {} as Patient;
  loading: boolean = false;
  documentTypes: any[] = [];

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.documentTypes = [
      { label: 'Cédula de Ciudadanía', value: 'CC' },
      { label: 'Tarjeta de Identidad', value: 'TI' },
      { label: 'Cédula de Extranjería', value: 'CE' },
      { label: 'Pasaporte', value: 'PP' }
    ];
  }

  savePatient() {
    if (!this.patient.documentType || !this.patient.documentNumber || !this.patient.firstName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe completar los campos requeridos'
      });
      return;
    }

    this.loading = true;

    this.patientsService.create(this.patient).subscribe({
      next: () => {
        this.loading = false;

        // Mostrar SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Paciente creado',
          text: `El paciente ${this.patient.firstName} ${this.patient.lastName} fue creado correctamente`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a lista después de cerrar el popup
          this.router.navigate(['/patients']);
        });
      },
      error: (err) => {
        this.loading = false;

        // Mostrar SweetAlert para errorasd
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error,
          confirmButtonText: 'Aceptar'
        });

      }
    });
  }

}
