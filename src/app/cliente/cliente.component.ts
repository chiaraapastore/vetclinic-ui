import {Component, HostListener, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authenticationService';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {NotificheService} from '../services/notifiche.service';
import {AppuntamentoService} from '../services/appuntamento.service';
import {ClienteService} from '../services/cliente.service';


@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  clienteUsername: string = '';
  notificheRecenti: any[] = [];
  animali: any[] = [];
  prossimoAppuntamento: any = null;
  dropdownOpen: boolean = false;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificheService: NotificheService,
    private appuntamentoService: AppuntamentoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.getClienteUsername();
    this.caricaNotificheRecenti();
    this.caricaAnimali();
    this.caricaProssimoAppuntamento();
  }

  async getClienteUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.clienteUsername = userProfile.username || 'Cliente';
      }
    } catch (error) {
      console.error('Errore nel recupero del nome utente:', error);
    }
  }

  caricaNotificheRecenti() {
    this.notificheService.getNotificationsForUser().subscribe({
      next: (notifiche) => {
        this.notificheRecenti = notifiche.map(n => ({
          testo: n.message,
          orario: this.getRelativeTime(n.notificationDate)
        }));
      },
      error: () => {
        console.error('Errore nel caricamento delle notifiche');
      }
    });
  }

  caricaAnimali() {
    this.clienteService.getAnimaliCliente().subscribe({
      next: (data) => {
        this.animali = data;
      },
      error: () => {
        console.error('Errore nel caricamento degli animali');
      }
    });
  }

  caricaProssimoAppuntamento() {
    this.appuntamentoService.getAppuntamentiCliente().subscribe({
      next: (appuntamenti) => {
        const futuri = appuntamenti.filter((a: any) => new Date(a.appointmentDate) > new Date());
        if (futuri.length > 0) {
          futuri.sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
          const primo = futuri[0];
          this.prossimoAppuntamento = {
            reason: primo.reason,
            date: new Date(primo.appointmentDate),
            veterinarianName: primo.veterinario?.firstName + ' ' + primo.veterinario?.lastName
          };
        }
      },
      error: () => {
        console.error('Errore nel caricamento degli appuntamenti del cliente');
      }
    });
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

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!event.target || !(event.target as HTMLElement).closest('.notifications-wrapper')) {
      this.dropdownOpen = false;
    }
  }
}
