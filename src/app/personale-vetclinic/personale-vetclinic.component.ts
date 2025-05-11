import {Component, OnInit} from '@angular/core';
import {AdminService} from '../services/admin.service';
import {CapoRepartoService} from '../services/capo-reparto.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {NotificheService} from '../services/notifiche.service';

@Component({
  selector: 'app-personale-vetclinic',
  standalone: false,
  templateUrl: './personale-vetclinic.component.html',
  styleUrl: './personale-vetclinic.component.css'
})
export class PersonaleVetclinicComponent implements OnInit{
  dottori: any[] = [];
  capoReparti: any[] = [];
  reparti: any[] = [];
  page: number = 1;
  assistenti: any[] = [];
  nuovoDottoreNome: string = '';
  nuovoDottoreCognome: string = '';
  nuovoDottoreUsername: string = '';
  nuovoDottoreEmail: string = '';
  nuovoCapoRepartoNome: string = '';
  nuovoCapoRepartoCognome: string = '';
  nuovoCapoRepartoEmail: string = '';
  nuovoDottoreRepartoNome: string = '';
  nuovoCapoRepartoNomeReparto: string = '';
  nuovoAssistenteNome: string = '';
  nuovoAssistenteCognome: string = '';
  nuovoAssistenteEmail: string = '';
  nuovoAssistenteNomeReparto: string = '';
  nuovoAssistenteUsername: string = '';
  nuovoCapoRepartoUsername: string = '';
  mostraTabella: boolean = false;
  nuovoDottoreRegistrationNumber: string = '';
  nuovoCapoRepartoRegistrationNumber: string = '';
  nuovoAssistenteRegistrationNumber: string = '';
  mostraDottore: boolean = false;
  mostraCapo: boolean = false;
  mostraAssistente: boolean = false;
  searchKeyword: string = '';

  originalDottori: any[] = [];
  originalAssistenti: any[] = [];
  originalCapoReparti: any[] = [];




  turni: string[] = ['Mattina', 'Pomeriggio', 'Notte', 'Monto', 'Smonto'];
  giorniSettimana: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  turniAssegnati: { [key: number]: { [giorno: string]: string } } = {};


  constructor(private adminService: AdminService, private notificheService: NotificheService ,private router: Router, private headOfDepartmentService: CapoRepartoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.caricaDati();
    this.loadCapoReparto();
    this.caricaReparti();
    this.loadDottori();
    this.loadAssistente();
    this.loadPersonale();
    this.originalDottori = [...this.dottori];
    this.originalAssistenti = [...this.assistenti];
    this.originalCapoReparti = [...this.capoReparti];


  }

  loadPersonale(): void {
    this.adminService.getAllVeterinaries().subscribe(data => {
      this.dottori = data;
      this.originalDottori = [...data];
    });

    this.adminService.getAllAssistants().subscribe(data => {
      this.assistenti = data;
      this.originalAssistenti = [...data];
    });

    this.adminService.getHeadOfDepartments().subscribe(data => {
      this.capoReparti = data;
      this.originalCapoReparti = [...data];
    });
  }

  applyFilters(): void {
    const term = this.searchKeyword.toLowerCase();

    this.dottori = this.originalDottori.filter(p =>
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );

    this.assistenti = this.originalAssistenti.filter(p =>
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );

    this.capoReparti = this.originalCapoReparti.filter(p =>
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  }

  searchPersonale(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.page = 1;
    this.loadPersonale();
  }


  caricaDati(): void {
    this.adminService.getAllVeterinaries().subscribe(data => {
      this.dottori = data.map((v: any) => ({
        ...v,
        reparto: v.reparto.name || 'Nessun reparto'
      }));
    });

    this.adminService.getHeadOfDepartments().subscribe(data => {
      this.capoReparti = data.map((h: any) => ({
        ...h,
        reparto: h.reparto.name || 'Nessun reparto'
      }));
    });

    this.adminService.getAllAssistants().subscribe(data => {
      this.assistenti = data.map((a: any) => ({
        ...a,
        reparto: a.reparto.name || 'Nessun reparto'
      }));
    });

    this.adminService.getAllDepartments().subscribe(data => {
      this.reparti = data;
    });
  }

  caricaReparti() {
    this.headOfDepartmentService.getReparti().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  aggiungiDottore() {
    if (!this.nuovoDottoreNome || !this.nuovoDottoreCognome || !this.nuovoDottoreUsername || !this.nuovoDottoreEmail || !this.nuovoDottoreRepartoNome || !this.nuovoDottoreRegistrationNumber ) {
      console.error("Tutti i campi sono obbligatori, incluso il reparto.");
      return;
    }

    console.log(" Valore di this.nuovoDottoreRepartoNome:", this.nuovoDottoreRepartoNome);

    const nuovoDottore = {
      firstName: this.nuovoDottoreNome,
      lastName: this.nuovoDottoreCognome,
      username: this.nuovoDottoreUsername,
      email: this.nuovoDottoreEmail,
      repartoNome: this.nuovoDottoreRepartoNome,
      registration_number: this.nuovoDottoreRegistrationNumber || undefined
    };

    console.log("Inviando il nuovo dottore al backend:", nuovoDottore);

    this.adminService.createVeterinarian(nuovoDottore).subscribe({
      next: (response: any) => {
        console.log("Risposta dal backend:", response);

        const messaggio = typeof response === 'string' ? response : response.message;

        this.toastr.success(messaggio || "Dottore aggiunto con successo!");
        this.caricaDati();
      },
      error: err => {
        console.error("Errore nell'aggiunta del dottore", err);
        this.toastr.error("Errore nell'aggiunta del dottore.");
      }
    });

  }

  toggleSelect(dottore: any): void {
    this.dottori.forEach(d => d.showReparto = false);
    dottore.showReparto = !dottore.showReparto;
  }



  aggiungiCapoReparto() {
    if (!this.nuovoCapoRepartoNome || !this.nuovoCapoRepartoCognome || !this.nuovoCapoRepartoUsername || !this.nuovoCapoRepartoEmail || !this.nuovoCapoRepartoNomeReparto || !this.nuovoCapoRepartoRegistrationNumber) {
      console.error("Tutti i campi sono obbligatori, incluso il reparto.");
      return;
    }

    const nuovoCapo = {
      firstName: this.nuovoCapoRepartoNome,
      lastName: this.nuovoCapoRepartoCognome,
      username: this.nuovoCapoRepartoUsername,
      email: this.nuovoCapoRepartoEmail,
      repartoNome: this.nuovoCapoRepartoNomeReparto,
      registration_number: this.nuovoCapoRepartoRegistrationNumber || undefined
    };


    console.log("Inviando capo reparto:", nuovoCapo);

    this.adminService.createHeadOfDepartment(nuovoCapo).subscribe({
      next: (response: any) => {
        console.log("Risposta dal backend:", response);

        const messaggio = typeof response === 'string' ? response : response.message;

        this.toastr.success(messaggio || "Capo Reparto aggiunto con successo!");
        this.caricaDati();
      },
      error: err => {
        console.error("Errore nell'aggiunta del capo reparto", err);
        this.toastr.error("Errore nell'aggiunta del capo reparto.");
      }
    });
  }

  assegnaDottoreAReparto(utenteId: number, event: Event): void {
    const repartoId = parseInt((event.target as HTMLSelectElement).value, 10);
    const reparto = this.reparti.find(r => r.id === repartoId);
    const repartoNome = reparto ? reparto.name : 'il nuovo reparto';

    if (isNaN(repartoId)) {
      this.toastr.error('Errore: Seleziona un reparto valido.');
      return;
    }

    this.adminService.assignDoctorToDepartment(utenteId, repartoId)
      .subscribe({
        next: () => {
          this.toastr.success('Dottore assegnato al reparto con successo!');
          this.notificheService.inviaNotifica(utenteId, `Sei stato spostato nel reparto: ${repartoNome}`).subscribe();
          this.loadDottori();
        },
        error: (error: any) => {
          console.error("Errore aggiornando il dottore nel reparto:", error);
          this.toastr.error('Errore nell\'assegnazione del dottore al reparto.');
        }
      });
  }

  assegnaCapoReparto(utenteId: number, event: Event): void {
    const repartoId = parseInt((event.target as HTMLSelectElement).value, 10);
    const reparto = this.reparti.find(r => r.id === repartoId);
    const repartoNome = reparto ? reparto.name : 'il nuovo reparto';

    if (isNaN(repartoId)) {
      this.toastr.error('Errore: Seleziona un reparto valido.');
      return;
    }

    this.adminService.assignHeadOfDepartment(utenteId, repartoId)
      .subscribe({
        next: () => {
          this.toastr.success('Capo reparto assegnato con successo!');
          this.notificheService.inviaNotifica(utenteId, `Sei stato spostato nel reparto: ${repartoNome}`).subscribe();
          this.loadCapoReparto();
        },
        error: (error: any) => {
          console.error("Errore aggiornando il capo reparto:", error);
          this.toastr.error('Errore nell\'aggiornamento del capo reparto.');
        }
      });
  }

  assegnaAssistenteAReparto(utenteId: number, event: Event): void {
    const repartoId = parseInt((event.target as HTMLSelectElement).value, 10);
    const reparto = this.reparti.find(r => r.id === repartoId);
    const repartoNome = reparto ? reparto.name : 'il nuovo reparto';

    if (isNaN(repartoId)) {
      this.toastr.error('Errore: Seleziona un reparto valido.');
      return;
    }

    this.adminService.assignAssistantToDepartment(utenteId, repartoId)
      .subscribe({
        next: () => {
          this.toastr.success('Assistente assegnato con successo!');
          this.notificheService.inviaNotifica(utenteId, `Sei stato spostato nel reparto: ${repartoNome}`).subscribe();
          this.loadAssistente();
        },
        error: (error: any) => {
          console.error("Errore aggiornando il capo reparto:", error);
          this.toastr.error('Errore nell\'aggiornamento del capo reparto.');
        }
      });
  }


  goBack(): void {
    this.router.navigate(['/admin']);
  }

  loadDottori(): void {
    this.adminService.getAllVeterinaries().subscribe({
      next: (data: any[]) => {
        console.log("Tutti i dottori ricevuti:", data);
        this.dottori = data.map(dottore => ({
          ...dottore,
          reparto: dottore.reparto || 'Nessun reparto',
          showReparto: false
        }));
      },
      error: (err: any) => console.error('Errore nel caricamento dei dottori', err)
    });
  }

  loadCapoReparto(): void {
    this.adminService.getHeadOfDepartments().subscribe({
      next: (data: any[]) => {
        console.log("Dati ricevuti dal backend per capi reparto:", data);
        this.capoReparti = data.map(capo => ({
          ...capo,
          reparto: capo.reparto?.name || "Nessun reparto"
        }));
      },
      error: (err: any) => console.error("Errore nel caricamento dei capi reparto", err)
    });
  }


  loadAssistente(): void {
    this.adminService.getAllAssistants().subscribe({
      next: (data: any[]) => {
        console.log("Dati ricevuti dal backend per capi reparto:", data);
        this.assistenti = data.map(assistente => ({
          ...assistente,
          reparto: assistente.reparto?.name || "Nessun reparto",
          showReparto: false
        }));
      },
      error: (err: any) => console.error("Errore nel caricamento dei capi reparto", err)
    });
  }


  toggleTurnoTable(capoRepartoId: number) {
    this.capoReparti.forEach(capo => {
      if (capo.id === capoRepartoId) {
        capo.showTurnoTable = !capo.showTurnoTable;
      } else {
        capo.showTurnoTable = false;
      }
    });
  }


  assegnaTurno(capoRepartoId: number, giorno: string, turno: string) {
    if (!this.turniAssegnati[capoRepartoId]) {
      this.turniAssegnati[capoRepartoId] = {};
    }

    if (this.turniAssegnati[capoRepartoId][giorno] === turno) {
      delete this.turniAssegnati[capoRepartoId][giorno];
    } else {
      this.turniAssegnati[capoRepartoId][giorno] = turno;
    }

    console.log(`Turni assegnati per il Capo Reparto ID ${capoRepartoId}:`, this.turniAssegnati[capoRepartoId]);
    this.notificheService.inviaNotifica(capoRepartoId, `Ti è stato assegnato il turno: ${turno} per ${giorno}`).subscribe();

  }

  getTurnoColor(capoRepartoId: number, giorno: string, turno: string): string {
    return this.turniAssegnati[capoRepartoId]?.[giorno] === turno ? this.getTurnoCssClass(turno) : 'transparent';
  }

  getTurnoCssClass(turno: string): string {
    const colors: { [key: string]: string } = {
      'Mattina': '#ffeb3b',
      'Pomeriggio': '#ff9800',
      'Notte': '#3f51b5',
      'Monto': '#26a69a',
      'Smonto': '#9e9e9e'
    };
    return colors[turno] || 'white';
  }

  aggiungiAssistente() {
    if (!this.nuovoAssistenteNome || !this.nuovoAssistenteCognome || !this.nuovoAssistenteUsername || !this.nuovoAssistenteEmail || !this.nuovoAssistenteNomeReparto || !this.nuovoAssistenteNomeReparto) {
      console.error("Tutti i campi sono obbligatori, incluso il reparto.");
      return;
    }

    console.log(" Valore di this.nuovoAssistenteNomeReparto:", this.nuovoAssistenteNomeReparto);

    const nuovoAssistente = {
      firstName: this.nuovoAssistenteNome,
      lastName: this.nuovoAssistenteCognome,
      username: this.nuovoAssistenteUsername,
      email: this.nuovoAssistenteEmail,
      repartoName: this.nuovoAssistenteNomeReparto,
      registration_number: this.nuovoAssistenteRegistrationNumber || undefined
    };



    console.log("Inviando il nuovo assistente al backend:", nuovoAssistente);

    this.adminService.createAssistant(nuovoAssistente).subscribe({
      next: (response: any) => {
        console.log("Risposta dal backend:", response);

        const messaggio = typeof response === 'string' ? response : response.message;

        this.toastr.success(messaggio || "Assistente aggiunto con successo!");
        this.caricaDati();
      },
      error: err => {
        console.error("Errore nell'aggiunta dell'assistente", err);
        this.toastr.error("Errore nell'aggiunta dell'assistente.");
      }
    });

  }

  eliminaUtente(utenteId: number): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Questa operazione rimuoverà l\'utente dal sistema!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00796b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, elimina!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.eliminaUtente(utenteId).subscribe({
          next: () => {
            this.toastr.success('Utente eliminato con successo!');
            this.caricaDati();
          },
          error: (error) => {
            console.error('Errore durante l\'eliminazione:', error);
            this.toastr.error('Errore durante l\'eliminazione.');
          }
        });
      }
    });
  }


}

