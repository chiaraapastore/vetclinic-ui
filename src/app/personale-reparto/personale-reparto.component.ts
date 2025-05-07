import {Component, OnInit} from '@angular/core';
import {CapoRepartoService} from '../services/capo-reparto.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

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
  reparti: any[] = [];
  ferieDisponibili: string[] = [];
  turni: string[] = ['Mattina', 'Pomeriggio', 'Notte', 'Monto', 'Smonto'];
  giorniSettimana: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  turniAssegnati: { [key: number]: { [giorno: string]: string } } = {};


  ngOnInit(): void {
    this.getRepartoUtente();
    this.caricaReparti();
    this.caricaFerieDisponibili();
  }

  constructor(
    private capoRepartoService: CapoRepartoService,
    private router: Router,
    private toastr: ToastrService,
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

  caricaReparti() {
    this.capoRepartoService.getReparti().subscribe({
      next: (data: any[]) => {
        console.log("Reparti ricevuti:", data);
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }


  caricaFerieDisponibili(): void {
    this.capoRepartoService.getUserInfo().subscribe({
      next: user => {
        console.log("User info completa:", user);
        const repartoId = user.repartoId;
        if (repartoId) {
          this.capoRepartoService.getFerieDisponibili(repartoId).subscribe({
            next: ferie => this.ferieDisponibili = ferie,
            error: err => console.error("Errore nel caricamento ferie:", err)
          });
        } else {
          console.error("Errore: il campo 'repartoId' è assente nell'oggetto utente:", user);
        }
      },
      error: err => console.error("Errore nel recupero info utente:", err)
    });
  }




  assegnaFerie(utenteId: number, startDate: string, endDate: string): void {
    this.capoRepartoService.assegnaFerie(utenteId, startDate, endDate).subscribe({
      next: () => this.toastr.success('Ferie assegnate con successo!'),
      error: () => this.toastr.error('Errore nell\'assegnazione delle ferie')
    });
  }


  toggleTurnoTable(utenteId: number, lista: any[]): void {
    lista.forEach(u => {
      if (u.id === utenteId) {
        u.showTurnoTable = !u.showTurnoTable;
      } else {
        u.showTurnoTable = false;
      }
    });
  }

  cambiaRepartoDottore(doctorId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const repartoId = selectElement?.value || '';

    if (!repartoId) {
      console.error("Nessun reparto selezionato!");
      return;
    }

    const repartoIdNumber = parseInt(repartoId, 10);
    if (isNaN(repartoIdNumber)) {
      console.error("Errore: ID reparto non valido");
      return;
    }

    console.log(`Cambio reparto del dottore con ID: ${doctorId} al reparto ${repartoIdNumber}`);
    this.capoRepartoService.getReparti().subscribe({
      next: (data: any[]) => {
        console.log("Reparti caricati:", data);
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }


  assegnaTurno(utenteId: number, giorno: string, turno: string): void {
    if (!this.turniAssegnati[utenteId]) {
      this.turniAssegnati[utenteId] = {};
    }

    const giaAssegnato = this.turniAssegnati[utenteId][giorno] === turno;
    if (giaAssegnato) {
      delete this.turniAssegnati[utenteId][giorno];
    } else {
      this.turniAssegnati[utenteId][giorno] = turno;

      const today = new Date();
      const giornoIndex = this.giorniSettimana.indexOf(giorno);
      const oggiIndex = today.getDay();
      const diff = ((giornoIndex + 1 + 7 - oggiIndex) % 7);
      const dataTurno = new Date(today);
      dataTurno.setDate(today.getDate() + diff);

      const startDate = dataTurno.toISOString().split('T')[0];
      const endDate = startDate;

      this.capoRepartoService.assegnaTurno(utenteId, startDate, endDate).subscribe({
        next: () => this.toastr.success(`Turno '${turno}' assegnato per ${giorno}`),
        error: () => this.toastr.error('Errore durante l\'assegnazione del turno')
      });
    }
  }


  getTurnoColor(utenteId: number, giorno: string, turno: string): string {
    return this.turniAssegnati[utenteId]?.[giorno] === turno
      ? this.getTurnoCssClass(turno)
      : 'transparent';
  }

  getTurnoCssClass(turno: string): string {
    const colori: { [key: string]: string } = {
      'Mattina': '#ffeb3b',
      'Pomeriggio': '#ff9800',
      'Notte': '#3f51b5',
      'Monto': '#26a69a',
      'Smonto': '#9e9e9e'
    };
    return colori[turno] || 'white';
  }

}
