import {Component, OnInit} from '@angular/core';
import {Animale} from '../models/animale.model';
import {ClienteService} from '../services/cliente.service';
import {ToastrService} from 'ngx-toastr';
import {AnimaleService} from '../services/animale.service';
import {Router} from '@angular/router';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {AssistenteService} from '../services/assistente.service';

@Component({
  selector: 'app-animali-cliente',
  standalone: false,
  templateUrl: './animali-cliente.component.html',
  styleUrl: './animali-cliente.component.css'
})
export class AnimaliClienteComponent implements OnInit {

  animali: Animale[] = [];
  selectedAnimalName: string = '';
  selectedAnimalHistory: CronologiaAnimale[] = [];
  showHistorySection: boolean = false;
  selectedAnimalId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private router: Router,
    private animaleService: AnimaleService,
    private assistenteService: AssistenteService,
  ) {}

  ngOnInit(): void {
    this.loadAnimali();
  }

  goBack(): void {
    this.router.navigate(['/cliente']);
  }

  loadAnimali(): void {
    this.clienteService.getAnimaliCliente().subscribe({
      next: (data) => {
        this.animali = data;
      },
      error: () => {
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
    console.log("Cliccato su cronologia per animaleId:", animaleId);
    this.isLoading = true;

    this.selectedAnimalId = animaleId;

    this.assistenteService.getAnimalFullHistory(animaleId).subscribe({
      next: (history: CronologiaAnimale[]) => {
        this.isLoading = false;
        console.log("Risposta ricevuta:", history);

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
