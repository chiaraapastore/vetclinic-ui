import {Component, OnInit} from '@angular/core';
import {Animale} from '../models/animale.model';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {AssistenteService} from '../services/assistente.service';
import {AnimaleService} from '../services/animale.service';
import {ToastrService} from 'ngx-toastr';
import { Location } from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-pazienti-animali',
  standalone: false,
  templateUrl: './pazienti-animali.component.html',
  styleUrl: './pazienti-animali.component.css'
})
export class PazientiAnimaliComponent implements OnInit {

  animali: Animale[] = [];
  selectedAnimalHistory: CronologiaAnimale[] = [];
  selectedAnimalName: string = '';
  showHistorySection: boolean = false;

  constructor(
    private assistenteService: AssistenteService,
    private animaleService: AnimaleService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadAnimali();
  }

  goBack(): void {
    this.router.navigate(['/assistente']);
  }

  loadAnimali(): void {
    this.assistenteService.getVeterinarianPatients().subscribe({
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
    this.assistenteService.getAnimalFullHistory(animaleId).subscribe({
      next: (history: CronologiaAnimale[]) => {
        this.selectedAnimalHistory = history.sort((a, b) =>
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
        this.selectedAnimalName = nomeAnimale;
        this.showHistorySection = true;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento della cronologia', err);
        this.toastr.error('Errore nel caricamento della cronologia.');
      }
    });
  }

  hideHistorySection(): void {
    this.showHistorySection = false;
    this.selectedAnimalHistory = [];
    this.selectedAnimalName = '';
  }
}
