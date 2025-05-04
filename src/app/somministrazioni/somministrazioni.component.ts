import {Component, OnInit} from '@angular/core';
import {Animale} from '../models/animale.model';
import {Medicine} from '../models/medicine.model';
import {SomministrazioneService} from '../services/somministrazione.service';
import {AnimaleService} from '../services/animale.service';
import {AssistenteService} from '../services/assistente.service';
import {MedicineService} from '../services/medicine.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Somministrazione} from '../models/somministrazione.model';

@Component({
  selector: 'app-somministrazioni',
  standalone: false,
  templateUrl: './somministrazioni.component.html',
  styleUrl: './somministrazioni.component.css'
})
export class SomministrazioniComponent implements OnInit {
  pazienti: Animale[] = [];
  medicine: Medicine[] = [];
  somministrazioni: Somministrazione[] = [];

  selectedAnimaleId?: number;
  selectedMedicineId?: number;
  quantita: number = 1;
  messaggio: string = '';

  constructor(
    private somministrazioneService: SomministrazioneService,
    private animaleService: AnimaleService,
    private assistenteService: AssistenteService,
    private router: Router,
    private medicineService: MedicineService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.assistenteService.getVeterinarianPatients().subscribe(p => {
      console.log("Pazienti ricevuti:", p);
      this.pazienti = p;
    });
    this.medicineService.getAvailableMedicines().subscribe(m => this.medicine = m);
  }


  goBack(): void {
    this.router.navigate(['/assistente']);
  }


  somministraFarmaco(): void {
    if (!this.selectedAnimaleId || !this.selectedMedicineId || !this.quantita) {
      this.messaggio = 'Compila tutti i campi';
      return;
    }

    const selectedId = Number(this.selectedAnimaleId);
    const animaleSelezionato = this.pazienti.find(a => a.id === selectedId);
    console.log("Animale selezionato:", animaleSelezionato);

    if (!animaleSelezionato || !animaleSelezionato.veterinario || !animaleSelezionato.veterinario.id) {
      this.messaggio = 'Veterinario non assegnato al paziente';
      return;
    }

    console.log("Veterinario dell'animale:", animaleSelezionato?.veterinario);


    const veterinarioId = animaleSelezionato.veterinario.id;

    this.somministrazioneService
      .somministraFarmaco(this.selectedAnimaleId, this.selectedMedicineId, this.quantita, veterinarioId)
      .subscribe({
        next: res => {
          this.toastr.success('Somministrazione effettuata con successo');
        },
        error: () => {
          this.toastr.error('Errore nella somministrazione');
        }
      });
    }

  getUnitForSelectedMedicine(): string {
    const med = this.medicine.find(m => m.id === this.selectedMedicineId);
    return med ? String(med.unitsToReceive) : 'unità';
  }



}
