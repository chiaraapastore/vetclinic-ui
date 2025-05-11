import { Component, OnInit } from '@angular/core';
import { Animale } from '../models/animale.model';
import { Medicine } from '../models/medicine.model';
import { SomministrazioneService } from '../services/somministrazione.service';
import { AssistenteService } from '../services/assistente.service';
import { Router } from '@angular/router';
import { MedicineService } from '../services/medicine.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-somministrazione-veterinario',
  standalone: false,
  templateUrl: './somministrazione-veterinario.component.html',
  styleUrl: './somministrazione-veterinario.component.css'
})
export class SomministrazioneVeterinarioComponent implements OnInit {
  pazienti: Animale[] = [];
  medicine: Medicine[] = [];
  selectedAnimaleId?: number;
  selectedMedicineId?: number;
  quantita: number = 1;

  constructor(
    private somministrazioneService: SomministrazioneService,
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

    this.medicineService.getAvailableMedicines().subscribe(m => {
      console.log("Medicine ricevute:", m);
      this.medicine = m;
    });
  }

  goBack(): void {
    this.router.navigate(['/veterinario']);
  }

  somministraFarmaco(): void {
    if (!this.selectedAnimaleId || !this.selectedMedicineId || !this.quantita) {
      this.toastr.warning('Compila tutti i campi');
      return;
    }

    const animale = this.pazienti.find(a => a.id === this.selectedAnimaleId);

    const capoRepartoId = animale?.reparto?.['capoRepartoId'];
    console.log("Capo Reparto ID:", capoRepartoId);

    if (!capoRepartoId) {
      this.toastr.error('Capo reparto non assegnato');
      return;
    }

    this.somministrazioneService
      .somministraFarmacoVeterinario(this.selectedAnimaleId, this.selectedMedicineId, this.quantita, capoRepartoId)
      .subscribe({
        next: () => this.toastr.success('Somministrazione effettuata con successo'),
        error: () => this.toastr.error('Animale o medicina non trovati')
      });
  }

  getUnitForSelectedMedicine(): string {
    const med = this.medicine.find(m => m.id === this.selectedMedicineId);
    return med ? String(med.unitsToReceive || 'unità') : 'unità';
  }
}
