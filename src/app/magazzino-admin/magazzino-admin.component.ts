import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Medicine} from '../models/medicine.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminService} from '../services/admin.service';
import {MedicineService} from '../services/medicine.service';

@Component({
  selector: 'app-magazzino-admin',
  standalone: false,
  templateUrl: './magazzino-admin.component.html',
  styleUrl: './magazzino-admin.component.css'
})
export class MagazzinoAdminComponent implements OnInit {
  medicinali: Medicine[] = [];
  filteredMedicinali: Medicine[] = [];
  searchKeyword: string = '';
  categorie: string[] = ['Tutti', 'Farmaci scaduti'];
  selectedCategory: string = 'Tutti';
  selectedSort: string = 'default';
  page: number = 1;
  filteredMedicine: Medicine[] = [];
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];
  showAddForm: boolean = false;
  showOrdina: boolean = false;
  showStorico: boolean = false;
  newMedicinale: any = {};
  newOrdine: any = { fornitore: '', materiale: '', quantita: 1 };
  storicoOrdini: any[] = [];
  reportConsumi: any[] = [];
  modificaInCorso: boolean = false;
  showReport: boolean = false;
  medicinaleDaModificare: any = {
    id: null,
    name: '',
    quantity: 0,
    availableQuantity: 0,
    dosage: '',
    expirationDate: ''
  };
  categorieFiltrate: string[] = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
    private medicineService: MedicineService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadMedicinali();
    this.loadStoricoOrdini();
    this.loadReportConsumi();
    this.loadOrdini();
    this.categorieFiltrate = [...this.categorie];
  }

  editMedicinale(medicinale: Medicine): void {
    this.medicinaleDaModificare = { ...medicinale };
    this.modificaInCorso = true;
  }

  salvaModificheMedicinale(): void {
    if (!this.medicinaleDaModificare || !this.medicinaleDaModificare.id) return;

    this.medicineService.updateMedicinale(this.medicinaleDaModificare).subscribe({
      next: () => {
        this.toastr.success('Farmaco aggiornato con successo.');
        this.modificaInCorso = false;
        this.medicinaleDaModificare = {
          id: null,
          name: '',
          quantity: 0,
          availableQuantity: 0,
          dosage: '',
          expirationDate: ''
        };
        this.loadMedicinali();
      },
      error: () => {
        this.toastr.error("Errore durante l'aggiornamento.");
      }
    });
  }

  toggleReport(): void {
    this.showReport = !this.showReport;
  }


  loadOrdini(): void {
    this.adminService.getOrders().subscribe({
      next: (response) => {},
      error: (err) => console.error("Errore ordini:", err)
    });
  }


  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedSort = 'default';
    this.page = 1;
    this.filteredMedicine = [];
    window.location.reload();
    this.router.navigate(['/magazzino-admin'], { queryParams: {} }).then(() => {
      this.loadMedicinali();
    });
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

  applyFilters(): void {
    this.filteredMedicinali = this.medicinali.filter(m => {
      const matchCategory =
        this.selectedCategory === 'Tutti' ||
        (this.selectedCategory === 'Farmaci scaduti' && this.isExpired(m.expiryDate));
      const matchSearch =
        this.searchKeyword === '' ||
        m.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (this.selectedSort === 'scadenzaAsc') {
      this.filteredMedicinali.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
    } else if (this.selectedSort === 'scadenzaDesc') {
      this.filteredMedicinali.sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime());
    }

    this.page = 1;
  }

  getMedicinaliForPage(): Medicine[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.filteredMedicinali.slice(startIndex, startIndex + this.pageSize);
  }

  isExpired(scadenza: Date | string | undefined): boolean {
    if (!scadenza) return false;
    const date = typeof scadenza === 'string' ? new Date(scadenza) : scadenza;
    return date.getTime() < new Date().getTime();
  }

  searchMedicinali(): void {
    this.applyFilters();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  toggleForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  aggiungiFarmaco(): void {
    if (!this.newMedicinale.nome || this.newMedicinale.quantita <= 0) {
      this.toastr.error('Inserisci un nome valido e una quantità maggiore di 0.', 'Errore');
      return;
    }

    const farmacoDaAggiungere = {
      nome: this.newMedicinale.nome,
      quantita: this.newMedicinale.quantita,
      availableQuantity: this.newMedicinale.availableQuantity,
      dosage: this.newMedicinale.dosage,
      expirationDate: this.newMedicinale.expirationDate
    };

    this.adminService.addMedicinal(farmacoDaAggiungere).subscribe({
      next: () => {
        this.toastr.success('Farmaco aggiunto con successo!', 'Successo');
        this.loadMedicinali();
      },
      error: (err: any) => console.error('Errore nell\'aggiunta del farmaco', err)
    });
  }

  updateMedicinaleQuantity(medicinale: Medicine): void {
    this.medicineService.updateAvailableQuantity(medicinale.id, medicinale.availableQuantity).subscribe({
      next: (updated) => {
        this.toastr.success('Quantità aggiornata con successo');
        this.loadMedicinali();
      },
      error: () => this.toastr.error('Errore aggiornamento quantità')
    });
  }

  deleteMedicinale(medicinale: Medicine): void {
    if (!medicinale.id) return;
    this.medicineService.deleteMedicinale(medicinale.id).subscribe({
      next: () => {
        this.toastr.success(`Farmaco ${medicinale.name} eliminato`);
        this.loadMedicinali();
      },
      error: () => this.toastr.error("Errore durante l'eliminazione")
    });
  }

  creaOrdine(): void {
    if (!this.newOrdine.fornitore || !this.newOrdine.materiale || this.newOrdine.quantita <= 0) {
      this.toastr.error('Compila tutti i campi dell\'ordine.');
      return;
    }
    const ordine = {
      supplierName: this.newOrdine.fornitore,
      quantity: this.newOrdine.quantita
    };

    this.adminService.createOrder(ordine).subscribe({
      next: ordineCreato => {
        this.toastr.success('Ordine creato con successo.');
        this.storicoOrdini.unshift(ordineCreato);
        this.newOrdine = { fornitore: '', materiale: '', quantita: 1 };
      },
      error: () => this.toastr.error('Errore durante la creazione dell\'ordine.')
    });
  }

  loadStoricoOrdini(): void {
    this.adminService.getOrderHistory().subscribe({
      next: (response) => this.storicoOrdini = response,
      error: (err) => console.error("Errore caricamento storico ordini:", err)
    });
  }

  aggiornaStatoOrdine(ordineId: number, nuovoStato: string): void {
    this.adminService.updateOrderState(ordineId, nuovoStato).subscribe({
      next: () => {
        this.toastr.success('Stato ordine aggiornato');
        const ordine = this.storicoOrdini.find(o => o.id === ordineId);
        if (ordine) ordine.status = nuovoStato;
      },
      error: () => this.toastr.error('Errore aggiornamento stato')
    });
  }

  loadReportConsumi(): void {
    this.adminService.getReportConsumi().subscribe({
      next: (response) => {
        console.log('Report consumi:', response);
        this.reportConsumi = response;
      },
      error: (err) => console.error("Errore nel caricamento dei report consumi:", err)
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
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



}
