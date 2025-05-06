import {Component, HostListener, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';
import {VeterinarioService} from '../services/veterinario.service';
import {NotificheService} from '../services/notifiche.service';
import {CapoRepartoService} from '../services/capo-reparto.service';
import {AuthenticationService} from '../auth/authenticationService';
import {AppuntamentoService} from '../services/appuntamento.service';
import {SomministrazioneService} from '../services/somministrazione.service';

@Component({
  selector: 'app-capo-reparto',
  standalone: false,
  templateUrl: './capo-reparto.component.html',
  styleUrl: './capo-reparto.component.css'
})
export class CapoRepartoComponent implements OnInit {
  reparti: any[] = [];
  medicinali: any[] = [];
  dottori: any[] = [];
  headOfDepartmentUsername: string = '';
  userId!: number;
  unreadNotifications: number = 0;
  notifications: any[] = [];
  appuntamentiOggi: any[] = [];
  attivitaRecenti: any[] = [];
  dropdownOpen: boolean = false;
  selectedRepartoId!: number;
  selectedPatientName: string = '';

  constructor(
    private doctorService: VeterinarioService,
    public authenticationService: AuthenticationService,
    private somministrazioneService: SomministrazioneService,
    private router: Router,
    private keycloakService: KeycloakService,
    private appuntamentoService: AppuntamentoService,
    private notificationService: NotificheService,
    private headOfDepartmentService: CapoRepartoService,
  ) {}

  ngOnInit() {
    this.caricaDottori();
    this.getHeadOfDepartmentUsername();
    this.listenForNewNotifications();
    this.loadAppuntamentiDelGiorno();
    this.loadAttivitaRecenti();
  }



  caricaDottori() {
    if (!this.selectedRepartoId) return;
    this.doctorService.getVeterinariByDepartment(this.selectedRepartoId).subscribe((data: any[]) => {
      this.dottori = data;
    });
  }

  async getHeadOfDepartmentUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.headOfDepartmentUsername = userProfile.username || 'Capo Reparto';
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
          const recenti = notifiche.map(n => ({
            testo: n.message,
            orario: this.getRelativeTime(n.notificationDate)
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

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.notificationService.markAllNotificationsAsRead().subscribe(() => {
      this.notifications.forEach(n => n.letta = true);
      this.unreadNotifications = 0;
    });
  }

  deleteAllNotifications(event: Event) {
    event.stopPropagation();
    this.notifications = [];
    this.unreadNotifications = 0;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.loadNotifications();
    }
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
  listenForNewNotifications() {
    setInterval(() => {
      this.loadNotifications();
    }, 5000);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
