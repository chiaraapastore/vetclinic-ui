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


  inviaPromemoria(appuntamento: Appuntamento): void {
    const message = `Gentile ${appuntamento.cliente.firstName}, ti ricordiamo di completare il pagamento per l'appuntamento del ${new Date(appuntamento.appointmentDate).toLocaleDateString()}.`;

    this.pagamentoService.inviaNotificaPagamento(appuntamento.cliente.id, message).subscribe({
      next: () => {
        this.toastr.success('Promemoria inviato al cliente');
      },
      error: err => {
        console.error('Errore invio promemoria:', err);
        this.toastr.error('Errore nell’invio del promemoria');
      }
    });
  }

}
