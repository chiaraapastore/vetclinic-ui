

import { Component, HostListener, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authenticationService';
import { NotificheService } from '../services/notifiche.service';
import { AssistenteService } from '../services/assistente.service';
import {AppuntamentoService} from '../services/appuntamento.service';
import {SomministrazioneService} from '../services/somministrazione.service';

@Component({
  selector: 'app-assistente',
  standalone: false,
  templateUrl: './assistente.component.html',
  styleUrl: './assistente.component.css'
})
export class AssistenteComponent implements OnInit {
  medicinali: any[] = [];
  pazientiAnimali: any[] = [];
  assistenteUsername: string = '';
  attivitaRecenti: any[] = [];
  unreadNotifications: number = 0;
  notifications: any[] = [];
  dropdownOpen: boolean = false;
  userId!: number;
  ordini: any[] = [];
  repartoId!: number;

  constructor(
    private assistenteService: AssistenteService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private keycloakService: KeycloakService,
    private notificationService: NotificheService,
    private appuntamentoService: AppuntamentoService,
    private somministrazioneService: SomministrazioneService,
  ) {}

  ngOnInit() {
    this.getAssistenteUsername();
    this.loadRepartoAndData();
    this.caricaPazientiAnimali();
    this.caricaOrdini();
    this.loadAttivitaRecenti();
  }

  loadRepartoAndData() {
    this.authenticationService.getUserInfo().subscribe(user => {
      if (user.repartoId) {
        this.repartoId = user.repartoId;
        this.caricaMedicinali(this.repartoId);
      } else {
        console.warn('Reparto non disponibile per l’utente', user);
      }
    });
  }


  loadAttivitaRecenti() {
    this.authenticationService.getUserInfo().subscribe(user => {
      const vetId = user?.id;
      if (!vetId) return;
      this.appuntamentoService.getVeterinarianPatients().subscribe({
        next: (pazienti) => {
          pazienti.forEach((paziente: any) => {
            const pazienteId = paziente.id;

            this.somministrazioneService.getSomministrazioniByPaziente(pazienteId).subscribe({
              next: (somministrazioni) => {
                const somministrazioniRecenti = somministrazioni.map((s: any) => ({
                  testo: `Somministrato ${s.medicine.name} a ${s.animal.name}`,
                  orario: this.getRelativeTime(s.date)
                }));
                this.attivitaRecenti.push(...somministrazioniRecenti);
                this.sortAttivita();
              }
            });
          });
        }
      });

      this.notificationService.getNotificationsForUser().subscribe({
        next: (notifiche) => {
          console.log('Notifiche ricevute:', notifiche);
          const recenti = notifiche.map(n => ({
            testo: n.message,
            orario: this.getRelativeTime(n.notificationDate),
            tipo: n.type
          }));
          this.attivitaRecenti.push(...recenti);
          this.attivitaRecenti.sort((a, b) => a.orario < b.orario ? 1 : -1);
        },
        error: () => {
          console.error('Errore nel recupero delle notifiche recenti');
        }
      });
    });
  }

  sortAttivita() {
    this.attivitaRecenti.sort((a, b) => b.orario.localeCompare(a.orario));
  }




  caricaPazientiAnimali() {
    this.assistenteService.getVeterinarianPatients().subscribe((data: any[]) => {
      this.pazientiAnimali = data;
    });
  }

  caricaMedicinali(repartoId: number) {
    this.assistenteService.viewDepartmentMedicines(repartoId).subscribe((data: any[]) => {
      this.medicinali = data;
    });
  }



  caricaOrdini() {
    this.assistenteService.getOrderHistory().subscribe((data: any[]) => {
      this.ordini = data;
    });
  }

  async getAssistenteUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.assistenteUsername = userProfile.username || 'Assistente';
      }
    } catch (error) {
      console.error('Errore nel recupero dell’utente:', error);
    }
  }

  loadNotifications() {
    if (!this.userId) return;
    this.notificationService.getNotificationsForUser().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadNotifications = notifications.filter(n => !n.letta).length;
      },
      error: (err) => console.error('Errore nel recupero notifiche:', err)
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('.notifications-wrapper')) {
      this.dropdownOpen = false;
    }
  }

  getRelativeTime(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} secondi fa`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  }



  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authenticationService.logout();
  }
}
