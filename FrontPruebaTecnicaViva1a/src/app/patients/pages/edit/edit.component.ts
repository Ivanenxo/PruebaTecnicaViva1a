import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from '../../services/patients.service';
import { Patient } from '../../Models/patient.model';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  patient: Patient = {} as Patient;
  loading: boolean = false;
  documentTypes: any[] = [];

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private route: ActivatedRoute, // <-- Para obtener ID desde la URL
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.documentTypes = [
      { label: 'Cédula de Ciudadanía', value: 'CC' },
      { label: 'Tarjeta de Identidad', value: 'TI' },
      { label: 'Cédula de Extranjería', value: 'CE' },
      { label: 'Pasaporte', value: 'PP' }
    ];

    this.patientsService.selectedPatient$.subscribe(p => {
      if (p) {
        this.patient = { ...p };
        console.log(p);
      } else {
        this.router.navigate(['/patients']);
      }
    });

  }

  loadPatient(id: number) {
    this.loading = true;
    this.patientsService.getById(id).subscribe({
      next: (data) => {
        this.patient = {
          ...data,
          documentType: data.documentType?.trim(),
          documentNumber: data.documentNumber?.trim(),
          firstName: data.firstName?.trim(),
          lastName: data.lastName?.trim(),
          phoneNumber: data.phoneNumber?.trim(),
          email: data.email?.trim(),
        };
        this.patient.documentType = this.patient.documentType?.trim();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el paciente' });
        console.error(err);
      }
    });
  }

  editPatient() {
    if (!this.patient.documentType || !this.patient.documentNumber || !this.patient.firstName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe completar los campos requeridos'
      });
      return;
    }

    this.loading = true;

    this.patientsService.update(this.patient.patientId, this.patient).subscribe({
      next: () => {
        this.loading = false;

        // Mostrar SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Paciente actualizado',
          text: `El paciente ${this.patient.firstName} ${this.patient.lastName} fue actualizado correctamente`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a lista después de cerrar el popup
          this.router.navigate(['/patients']);
        });
      },
      error: (err) => {
        this.loading = false;

        // SweetAlert para error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el paciente',
          confirmButtonText: 'Aceptar'
        });

        console.error('Error al actualizar paciente:', err);
      }
    });
  }

  

}
