import {Component, OnInit} from '@angular/core';
import {Appuntamento} from '../models/appuntamento.model';
import {PagamentoService} from '../services/pagamento.service';
import {generaFatturaPDF} from '../utils/fattura-pds';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-pagamenti',
  standalone: false,
  templateUrl: './pagamenti.component.html',
  styleUrl: './pagamenti.component.css'
})
export class PagamentiComponent implements OnInit {
  appuntamenti: Appuntamento[] = [];
  selectedMethod: { [id: number]: string } = {};
  cardType: { [id: number]: string } = {};
  selectedAmount: { [id: number]: number } = {};
  filtroStato: string = 'Tutti';


  constructor(private pagamentoService: PagamentoService, private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.caricaAppuntamenti();
  }

  goBack(): void {
    this.router.navigate(['/assistente']);
  }


  caricaAppuntamenti(): void {
    this.pagamentoService.getAppuntamenti().subscribe({
      next: data => this.appuntamenti = data,
      error: err => console.error('Errore nel recupero appuntamenti:', err)
    });
  }

  paga(appuntamento: Appuntamento): void {
    const method = this.selectedMethod[appuntamento.id];
    const card = this.cardType[appuntamento.id] || '';
    const amount = this.selectedAmount[appuntamento.id];

    if (!method) {
      this.toastr.warning('Seleziona metodo di pagamento', 'Attenzione');
      return;
    }


    if (!amount || isNaN(amount)) {
      this.toastr.warning('Seleziona un importo valido', 'Attenzione');
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


    this.pagamentoService.pagaAppuntamento(appuntamento.id, amount, appuntamento.cliente.id).subscribe({
      next: () => {
        this.toastr.success('Richiesta di pagamento inviata al cliente');
      },
      error: err => {
        console.error('Errore pagamento:', err);
        this.toastr.error('Errore nel pagamento');
      }
    });
  }




  getAppuntamentiFiltrati(): Appuntamento[] {
    if (this.filtroStato === 'Tutti') return this.appuntamenti;
    return this.appuntamenti.filter(app =>
      this.filtroStato === 'Pagati' ? app.status === 'PAID' : app.status !== 'PAID');
  }

  scaricaFattura(appuntamento: Appuntamento): void {
    generaFatturaPDF({
      ...appuntamento,
      metodo: this.selectedMethod[appuntamento.id],
      cardType: this.cardType[appuntamento.id],
      amount: this.selectedAmount[appuntamento.id]
    });
  }


}
