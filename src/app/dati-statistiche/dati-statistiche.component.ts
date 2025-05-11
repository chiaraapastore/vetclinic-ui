import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StatisticheService} from '../services/statistiche.service';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dati-statistiche',
  standalone: false,
  templateUrl: './dati-statistiche.component.html',
  styleUrl: './dati-statistiche.component.css'
})
export class DatiStatisticheComponent implements OnInit {
  consumiNelTempo: any[] = [];
  riordiniStockout: any[] = [];
  distribuzionePerReparto: any[] = [];
  loading: boolean = true;
  legendPosition = LegendPosition.Right;


  constructor(
    private statisticheService: StatisticheService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.caricaTuttiIDati();
  }

  caricaTuttiIDati(): void {
    this.loading = true;

    this.statisticheService.getConsumiNelTempo().subscribe(data => {
      this.consumiNelTempo = [data];
    });

    this.statisticheService.getRiordiniStockout().subscribe(data => {
      this.riordiniStockout = [data.riordini, data.stockout];
    });

    this.statisticheService.getDistribuzionePerReparto().subscribe(data => {
      this.distribuzionePerReparto = Array.isArray(data)
        ? data.map(item => ({
          name: item.reparto,
          value: Number(item.totale)
        }))
        : [];
      this.loading = false;
    }, error => {
      console.error('Errore nel caricamento dei dati:', error);
      this.loading = false;
    });
  }


  goBack(): void {
    this.router.navigate(['/admin']);
  }

}
