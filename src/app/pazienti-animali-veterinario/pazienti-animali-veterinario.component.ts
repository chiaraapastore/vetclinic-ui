import {Component, OnInit} from '@angular/core';
import {Animale} from '../models/animale.model';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {AnimaleService} from '../services/animale.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {VeterinarioService} from '../services/veterinario.service';

@Component({
  selector: 'app-pazienti-animali-veterinario',
  standalone: false,
  templateUrl: './pazienti-animali-veterinario.component.html',
  styleUrl: './pazienti-animali-veterinario.component.css'
})
export class PazientiAnimaliVeterinarioComponent implements OnInit {

  animali: Animale[] = [];
  selectedAnimalHistory: CronologiaAnimale[] = [];
  selectedAnimalName: string = '';
  showHistorySection: boolean = false;
  newEventType: string = '';
  newEventDescription: string = '';
  selectedAnimalId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private veterinarioService: VeterinarioService,
    private animaleService: AnimaleService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnimali();
  }

  goBack(): void {
    this.router.navigate(['/veterinario']);
  }


  loadAnimali(): void {
    this.veterinarioService.getVeterinarianPatients().subscribe({
      next: (data) => {
        this.animali = data;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento degli animali', err);
        this.toastr.error('Errore nel caricamento degli animali.');
      }
    });
  }

  downloadMedicalRecord(pazienteId: number): void {
    this.animaleService.downloadMedicalRecord(pazienteId).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
          this.toastr.error("Errore: il PDF è vuoto o non disponibile.", "Errore");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cartella_Clinica_${pazienteId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success("Cartella clinica scaricata con successo!", "Successo");
      },
      error: (err) => {
        this.toastr.error("Errore nel download della cartella clinica: " + err.message, "Errore");
      }
    });
  }

  loadAnimalHistory(animaleId: number, nomeAnimale: string): void {
    this.isLoading = true;
    this.selectedAnimalId = animaleId;

    this.veterinarioService.getAnimalFullHistory(animaleId).subscribe({
      next: (history: CronologiaAnimale[]) => {
        this.isLoading = false;
        this.selectedAnimalHistory = history || [];
        this.selectedAnimalName = nomeAnimale;
        this.showHistorySection = true;

        if (this.selectedAnimalHistory.length === 0) {
          this.toastr.info(`Nessun evento registrato per ${nomeAnimale}.`, 'Cronologia vuota');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Errore nel caricamento della cronologia', err);
        this.toastr.error('Errore nel caricamento della cronologia.');
      }
    });
  }

  addNewEvent(): void {
    if (!this.newEventType || !this.newEventDescription) {
      this.toastr.error('Devi compilare tipo evento e descrizione.');
      return;
    }

    if (!this.selectedAnimalId) {
      this.toastr.error('Animale non selezionato correttamente.');
      return;
    }

    this.veterinarioService.addEventToAnimal(this.selectedAnimalId, {
      eventType: this.newEventType,
      description: this.newEventDescription
    }).subscribe({
      next: () => {
        this.toastr.success('Evento aggiunto correttamente!');
        this.loadAnimalHistory(this.selectedAnimalId!, this.selectedAnimalName);
        this.newEventType = '';
        this.newEventDescription = '';
      },
      error: (err) => {
        console.error('Errore aggiunta evento', err);
        this.toastr.error('Errore durante l\'aggiunta.');
      }
    });
  }

  toggleAnimalHistory(animaleId: number, nomeAnimale: string): void {
    if (this.selectedAnimalId === animaleId && this.showHistorySection) {
      this.showHistorySection = false;
      this.selectedAnimalId = null;
      this.selectedAnimalHistory = [];
      this.selectedAnimalName = '';
    } else {
      this.loadAnimalHistory(animaleId, nomeAnimale);
    }
  }
}
