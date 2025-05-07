import {Component, OnInit} from '@angular/core';
import {CapoRepartoService} from '../services/capo-reparto.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-personale-reparto',
  standalone: false,
  templateUrl: './personale-reparto.component.html',
  styleUrl: './personale-reparto.component.css'
})
export class PersonaleRepartoComponent implements OnInit {

  veterinari: any[] = [];
  assistenti: any[] = [];
  selectedRepartoId!: number;


  ngOnInit(): void {
    this.getRepartoUtente();
  }

  constructor(
    private capoRepartoService: CapoRepartoService,
    private router: Router
  ) {}

  getRepartoUtente(): void {
    this.capoRepartoService.getUserInfo().subscribe({
      next: (utente) => {
        this.selectedRepartoId = utente.repartoId;
        this.loadPersonale();
      },
      error: err => console.error("Errore nel caricamento utente:", err)
    });
  }

  loadPersonale(): void {
    this.capoRepartoService.getPersonaleDelReparto(this.selectedRepartoId).subscribe({
      next: res => {
        this.veterinari = res.veterinari;
        this.assistenti = res.assistenti;
      },
      error: err => console.error("Errore nel caricamento del personale:", err)
    });
  }

  goBack(): void {
    this.router.navigate(['/capo-reparto']);
  }
}
