import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../Models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private apiUrl = 'https://localhost:7074/api/Patients';

  private selectedPatientSubject = new BehaviorSubject<Patient | null>(null);
  selectedPatient$: Observable<Patient | null> = this.selectedPatientSubject.asObservable();



  constructor(private http: HttpClient) {}


   getPatients(firstName?: string, documentNumber?: string): Observable<Patient[]> {
    let params = new HttpParams();

    if (firstName) params = params.set('name', firstName);
    if (documentNumber) params = params.set('documentNumber', documentNumber);

    return this.http.get<Patient[]>(this.apiUrl, { params });
  }


  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }


  create(patient: Patient): Observable<any> {
    return this.http.post(this.apiUrl, patient);
  }


  update(id: number, patient: Patient): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patient);
  }


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  selectPatient(patient: Patient) {
    this.selectedPatientSubject.next(patient);
  }

  getPatientscreatedafter( fecha:string): Observable<Patient[]> {
    let params = new HttpParams();

    if (fecha != null) params = params.set('date', fecha.toString());

    return this.http.get<Patient[]>(`${this.apiUrl}/created-after`, { params });
  }

}
