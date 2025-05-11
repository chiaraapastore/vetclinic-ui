import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Medicine} from '../models/medicine.model';
import {AuthenticationService} from '../auth/authenticationService';
import {MedicineService} from '../services/medicine.service';
import {ToastrService} from 'ngx-toastr';
import {NotificheService} from '../services/notifiche.service';
import {Router} from '@angular/router';
import {AssistenteService} from '../services/assistente.service';

@Component({
  selector: 'app-magazzino-assistente',
  standalone: false,
  templateUrl: './magazzino-assistente.component.html',
  styleUrl: './magazzino-assistente.component.css'
})
export class MagazzinoAssistenteComponent implements OnInit {

  medicinali: Medicine[] = [];
  filteredMedicinali: Medicine[] = [];
  categorie: string[] = ['Tutti', 'Farmaci scaduti'];
  selectedCategory: string = 'Tutti';
  searchKeyword: string = '';
  selectedSort: string = 'default';
  page: number = 1;
  selectedRepartoId!: number;
  filteredMedicine: Medicine[] = [];
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];
  showOrdina: boolean = false;
  showStorico: boolean = false;
  showEsaurimento: boolean = false;
  newMedicinale: any = {};
  newOrdine: any = { fornitore: '', materiale: '', quantita: 1 };
  showAddForm = false;
  storicoOrdini: any[] = [];
  editableMedicineId: number | null = null;
  categorieFiltrate: string[] = [];
  emergenze: any[] = [];

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private medicineService: MedicineService,
    private assistenteService: AssistenteService,
    private notificationService: NotificheService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadMedicinali();
    this.loadEmergenze();
    this.loadOrdini();
    this.loadStoricoOrdini();
    this.categorieFiltrate = [...this.categorie];

  }

  editMedicinale(medicinale: Medicine): void {
    this.editableMedicineId = medicinale.id ?? null;
  }


  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  loadMedicinali(): void {
    this.medicineService.getAvailableMedicines().subscribe({
      next: (response: Medicine[]) => {
        this.medicinali = response.map(m => ({
          ...m,
          expiryDate: m.expirationDate
        }));
        this.applyFilters();
      },
      error: (err) => console.error("Errore nel caricamento dei medicinali:", err)
    });
  }


  isExpired(scadenza: Date | string | undefined): boolean {
    if (!scadenza) return false;
    const date = typeof scadenza === 'string' ? new Date(scadenza) : scadenza;
    return date.getTime() < new Date().getTime();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedSort = 'default';
    this.page = 1;
    this.filteredMedicine = [];
    window.location.reload();
    this.router.navigate(['/magazzino-assistente'], { queryParams: {} }).then(() => {
      this.loadMedicinali();
    });
  }


  applyFilters(): void {
    this.filteredMedicinali = this.medicinali.filter(m => {
      const matchCategory = this.selectedCategory === 'Tutti' ||
        (this.selectedCategory === 'Farmaci scaduti' && this.isExpired(m.expiryDate));
      const matchSearch = this.searchKeyword === '' || m.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (this.selectedSort === 'scadenzaAsc') {
      this.filteredMedicinali.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
    } else if (this.selectedSort === 'scadenzaDesc') {
      this.filteredMedicinali.sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime());
    }

    this.page = 1;
  }

  searchMedicinali(): void {
    this.applyFilters();
  }


  getMedicinaliForPage(): Medicine[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredMedicinali.slice(startIndex, endIndex);
  }


  toggleForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  aggiungiFarmaco(): void {
    if (!this.newMedicinale.nome || this.newMedicinale.quantita <=0) {
      this.toastr.error('Inserisci un nome valido e una quantità maggiore di 0.', 'Errore');
      return;
    }

    const farmacoDaAggiungere = {
      nome: this.newMedicinale.nome,
      quantita: this.newMedicinale.quantita,
      availableQuantity: this.newMedicinale.availableQuantity,
      scadenza: this.newMedicinale.scadenza || '',
      dosage: this.newMedicinale.dosage,
      expirationDate: this.newMedicinale.expirationDate,
      repartoId: this.selectedRepartoId
    };



    this.assistenteService.aggiungiFarmaco(farmacoDaAggiungere).subscribe({
      next: () => {
        this.toastr.success('Farmaco aggiunto con successo!', 'Successo');
        this.loadMedicinali();
      },
      error: (err: any) => console.error('Errore nell\'aggiunta del farmaco', err)
    });
  }





  updateMedicinaleQuantity(medicinale: Medicine): void {
    this.medicineService.updateAvailableQuantity(medicinale.id, medicinale.availableQuantity).subscribe({
      next: (updatedMedicinale) => {
        console.log("Risposta ricevuta dal server:", updatedMedicinale);

        if (!updatedMedicinale) {
          console.error("Errore: risposta vuota dal backend");
          return;
        }

        let index = this.medicinali.findIndex(m => m.id === medicinale.id);
        if (index !== -1) {
          this.medicinali[index].availableQuantity = updatedMedicinale.availableQuantity;
        }

        this.toastr.success('Quantità disponibile aggiornata con successo');

        this.loadMedicinali();
      },
      error: (err) => {
        console.error("Errore durante l'aggiornamento della quantità disponibile:", err);
        this.toastr.error("Errore durante l'aggiornamento.", "Errore");
      }
    });
  }


  deleteMedicinale(medicinale: Medicine): void {
    if (!medicinale.id) {
      console.error("Errore: ID farmaco non valido.");
      return;
    }

    this.medicineService.deleteMedicinale(medicinale.id).subscribe({
      next: () => {
        this.toastr.success(`Farmaco ${medicinale.name} eliminato con successo.`);
        this.loadMedicinali();
      },
      error: (err: any) => {
        console.error("Errore durante l'eliminazione del farmaco:", err);
        this.toastr.error("Errore durante l'eliminazione del farmaco.", "Errore");
      }
    });
  }

  creaOrdine(): void {
    if (!this.newOrdine.fornitore || !this.newOrdine.materiale || this.newOrdine.quantita <= 0) {
      this.toastr.error('Compila tutti i campi dell\'ordine.');
      return;
    }

    this.assistenteService.createOrdine(this.newOrdine.fornitore, this.newOrdine.quantita).subscribe({
      next: ordineCreato => {
        this.toastr.success('Ordine creato con successo.');
        this.storicoOrdini.unshift(ordineCreato);
        this.newOrdine = { fornitore: '', materiale: '', quantita: 1 };
      },
      error: (err) => {
        console.error('Errore ordine:', err);
        this.toastr.error('Errore durante la creazione dell\'ordine.');
      }
    });
  }

  farmaciScaduti(): void {
    const scaduti = this.medicinali.filter(m => this.isExpired(m.expiryDate));
    if (scaduti.length === 0) {
      this.toastr.info('Nessun farmaco scaduto.');
      return;
    }

    scaduti.forEach(m => {
      if (m.id !== undefined) {
        this.assistenteService.scadenzaFarmaco(1, m.id).subscribe({
          next: () => this.toastr.success(`Segnalazione per ${m.name}`),
          error: () => this.toastr.error(`Errore segnalazione ${m.name}`)
        });
      } else {
        console.warn(`Farmaco ${m.name} non ha un ID definito e non può essere segnalato.`);
      }
    });
  }


  loadEmergenze(): void {
    this.assistenteService.getEmergenze().subscribe({
      next: (response) => this.emergenze = response,
      error: (err) => console.error("Errore emergenze:", err)
    });
  }

  loadOrdini(): void {
    this.assistenteService.getOrdini().subscribe({
      next: (response) => {},
      error: (err) => console.error("Errore ordini:", err)
    });
  }

  loadStoricoOrdini(): void {
    this.assistenteService.getOrderHistory().subscribe({
      next: (response) => {
        this.storicoOrdini = response;
      },
      error: (err) => console.error("Errore nel caricamento dello storico ordini:", err)
    });
  }

  goBack(): void {
    this.router.navigate(['/assistente']);
  }

  countByCategory(category: string): number {
    if (category === 'Tutti') return this.medicinali.length;
    if (category === 'Farmaci scaduti') return this.medicinali.filter(m => this.isExpired(m.expiryDate)).length;
    return this.medicinali.filter(m => m.categoria === category).length;
  }

  goToPreviousPage(): void { if (this.page > 1) this.page--; }
  goToNextPage(): void { if (this.page < this.totalPages) this.page++; }
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.applyFilters();
  }
  get totalPages(): number {
    return Math.ceil(this.filteredMedicinali.length / this.pageSize) || 1;
  }

  aggiornaStatoOrdine(ordineId: number, nuovoStato: string): void {
    this.assistenteService.aggiornaStatoOrdine(ordineId, nuovoStato).subscribe({
      next: () => {
        this.toastr.success('Stato ordine aggiornato con successo!', 'Successo');

        const ordineIndex = this.storicoOrdini.findIndex(o => o.id === ordineId);
        if (ordineIndex !== -1) {
          this.storicoOrdini[ordineIndex].status = nuovoStato;
        }
      },
      error: (err) => {
        console.error('Errore nell\'aggiornamento dello stato ordine:', err);
        this.toastr.error('Errore durante l\'aggiornamento dello stato.', 'Errore');
      }
    });
  }

}
