import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UtenteService} from '../services/utente.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profilo-vetterinario',
  standalone: false,
  templateUrl: './profilo-veterinario.component.html',
  styleUrl: './profilo-veterinario.component.css'
})
export class ProfiloVeterinarioComponent implements OnInit {
  userDetails: any = {
    firstName: '',
    lastName: '',
    email: '',
    registrationNumber: '',
    reparto: { name: '' },
    profileImage: 'https://i.pinimg.com/736x/0e/f1/e6/0ef1e673912e6b7b0fdddc60296a9242.jpg',
    nameDepartment: ''
  };
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private utenteService: UtenteService,private router: Router ,private http: HttpClient, private toastr: ToastrService, private location: Location) {}

  ngOnInit(): void {

    this.utenteService.getUserInfo().subscribe(
      (data) => {
        if (data) {
          this.userDetails = data;
          if (!this.userDetails.reparto) {
            this.userDetails.reparto = { name: 'Nessun reparto assegnato' };
          }
          if (!this.userDetails.profileImage) {
            this.userDetails.profileImage = 'https://i.pinimg.com/736x/0e/f1/e6/0ef1e673912e6b7b0fdddc60296a9242.jpg';
          }
        }
        console.log('Dati utente ricevuti:', data);

      },

      (error) => {
        console.error('Errore nel recupero dati utente', error);
      }
    );
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  goBack(): void {
    this.router.navigate(['/veterinario']);
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userDetails.profileImage = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile as Blob);
      }
    }
  }


  updateProfile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post(`/api/upload-profile-image/${this.userDetails.id}`, formData).subscribe(
        (response: any) => {
          console.log('Immagine caricata', response);
          this.userDetails.profileImage = response.imageUrl;
        },
        (error) => console.error('Errore nel caricamento dell\'immagine', error)
      );
    }

    this.utenteService.updateUtente(this.userDetails.id, this.userDetails).subscribe(
      () => {
        this.toastr.success('Profilo aggiornato con successo!', 'Successo');
      },
      (error) => {
        console.error('Errore aggiornamento profilo', error);
        this.toastr.error('Errore aggiornamento profilo', 'Errore');
      }
    );
  }
}

