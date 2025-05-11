import {Component, HostListener, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {AuthenticationService} from '../auth/authenticationService';
import {Router} from '@angular/router';
import {NotificheService} from '../services/notifiche.service';
import {AppuntamentoService} from '../services/appuntamento.service';
import {SomministrazioneService} from '../services/somministrazione.service';

@Component({
  selector: 'app-veterinario',
  standalone: false,
  templateUrl: './veterinario.component.html',
  styleUrl: './veterinario.component.css'
})
export class VeterinarioComponent implements OnInit {
  doctorUsername: string = '';
  unreadNotifications: number = 0;
  notifications: any[] = [];
  appuntamentiOggi: any[] = [];
  attivitaRecenti: any[] = [];
  dropdownOpen: boolean = false;
  userId!: number;

  constructor(
    private keycloakService: KeycloakService,
    private somministrazioneService: SomministrazioneService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificheService,
    private appuntamentoService: AppuntamentoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getDoctorUsername();
    this.loadAppuntamentiDelGiorno();
    this.loadAttivitaRecenti();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  loadAppuntamentiDelGiorno() {
    this.appuntamentoService.getAppointmentsCreatedByAssistant().subscribe({
      next: (appointments) => {
        const oggi = new Date().toISOString().split('T')[0];
        this.appuntamentiOggi = appointments
          .filter(app => {
            const appDate = new Date(app.appointmentDate).toISOString().split('T')[0];
            return appDate === oggi;
          })
          .map(app => ({
            nome: app.animal?.name || 'Animale',
            orario: new Date(app.appointmentDate).toISOString().substring(11, 16),
            tipo: app.reason || 'Visita',
            stato: app.status || 'In attesa'
          }));
      },
      error: () => {
        console.error('Errore nel recupero degli appuntamenti di oggi');
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
                  testo: `Somministrato ${s.medicine?.name} a ${s.animal?.name}`,
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


  async getDoctorUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.doctorUsername = userProfile.username || 'Veterinario';
      }
    } catch (error) {
      console.error('Errore nel recupero dell’utente:', error);
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.loadNotifications();
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


  logout() {
    this.authenticationService.logout();
  }
}
