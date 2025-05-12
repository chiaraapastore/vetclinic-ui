import {Component, OnInit} from '@angular/core';
import {Fattura} from '../models/fattura.model';
import {generaFatturaPDF} from '../utils/fattura-pds';
import {ToastrService} from 'ngx-toastr';
import {ClienteService} from '../services/cliente.service';
import {Router} from '@angular/router';
import {PagamentoService} from '../services/pagamento.service';
import {Appuntamento} from '../models/appuntamento.model';
import {AssistenteService} from '../services/assistente.service';

@Component({
  selector: 'app-pagamenti-cliente',
  standalone: false,
  templateUrl: './pagamenti-cliente.component.html',
  styleUrl: './pagamenti-cliente.component.css'
})
export class PagamentiClienteComponent implements OnInit {
  fatture: Fattura[] = [];
  appuntamenti: Appuntamento[] = [];
  selectedAmount: { [id: number]: number } = {};
  filtroStato: string = 'Tutti';
  selectedMethod: { [id: number]: string } = {};
  cardType: { [id: number]: string } = {};
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];
  page: number = 1;
  filteredPagamenti: Appuntamento[] = [];

  constructor(private clienteService: ClienteService, private assistenteService: AssistenteService,private pagamentoService: PagamentoService,   private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.caricaFatture();
    this.caricaAppuntamenti();
  }

  goBack(): void {
    this.router.navigate(['/cliente']);
  }

  caricaFatture(): void {
    this.clienteService.getFattureCliente().subscribe({
      next: data => this.fatture = data,
      error: err => {
        console.error('Errore nel recupero delle fatture', err);
        this.toastr.error('Errore nel caricamento delle fatture.');
      }
    });
  }

  caricaAppuntamenti(): void {
    this.clienteService.getAppuntamentiCliente().subscribe({
      next: data => (this.appuntamenti = data),
      error: err => {
        console.error('Errore nel recupero degli appuntamenti', err);
        this.toastr.error('Errore nel caricamento degli appuntamenti.');
      }
    });
  }

  scaricaFattura(appuntamento: Appuntamento): void {
    generaFatturaPDF({
      ...appuntamento,
      metodo: this.selectedMethod[appuntamento.id],
      cardType: this.cardType[appuntamento.id],
      amount: this.selectedAmount[appuntamento.id]
    });
  }



  pagaPagamento(appuntamento: Appuntamento): void {
    const method = this.selectedMethod[appuntamento.id];
    const card = this.cardType[appuntamento.id] || '';
    const amount = this.selectedAmount[appuntamento.id];

    if (!method) {
      this.toastr.warning('Seleziona metodo di pagamento', 'Attenzione');
      return;
    }

    if (!appuntamento.cliente || !appuntamento.cliente.id) {
      this.toastr.error('Cliente non valido');
      return;
    }

    if (method === 'Carta' && !card) {
      this.toastr.warning('Specifica il tipo di carta', 'Attenzione');
      return;
    }

    this.assistenteService.updateAppointmentAmount(appuntamento.id, amount).subscribe({
      next: () => {

        this.pagamentoService.pagaAppuntamento(appuntamento.id).subscribe({
          next: () => {
            this.toastr.success('Pagamento effettuato con successo');
            this.caricaAppuntamenti();
            this.caricaFatture();
          },
          error: err => {
            console.error('Errore pagamento:', err);
            this.toastr.error('Errore nel pagamento');
          }
        });
      },
      error: () => {
        this.toastr.error("Errore nel salvataggio dell’importo.");
      }
    });
  }

  getAppuntamentiFiltrati(): Appuntamento[] {
    let filteredList = this.appuntamenti;
    if (this.filtroStato !== 'Tutti') {
      filteredList = this.appuntamenti.filter(app =>
        this.filtroStato === 'Pagati' ? app.status === 'PAID' : app.status !== 'PAID');
    }

    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    return filteredList.slice(start, end);
  }

  updateFilteredPagamenti(): void {
    this.filteredPagamenti = this.getAppuntamentiFiltrati();  // Use filtered and paginated list
  }


  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateFilteredPagamenti();
    }
  }

  goToNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateFilteredPagamenti();
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.updateFilteredPagamenti();
  }

  get totalPages(): number {
    return Math.ceil(this.appuntamenti.length / this.pageSize) || 1;
  }


}
