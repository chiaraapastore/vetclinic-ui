

import { Component, HostListener, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authenticationService';
import { NotificheService } from '../services/notifiche.service';
import { AssistenteService } from '../services/assistente.service';

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
    private notificationService: NotificheService
  ) {}

  ngOnInit() {
    this.getAssistenteUsername();
    this.loadRepartoAndData();
    this.caricaPazientiAnimali();
    this.caricaOrdini();
    this.listenForNewNotifications();
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
    this.notificationService.markAllNotificationsAsRead().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (err) => console.error('Errore nel recupero notifiche:', err)
    });
  }

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.notificationService.markAllNotificationsAsRead().subscribe(() => {
      this.loadNotifications();
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

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} secondi fa`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  }

  listenForNewNotifications() {
    setInterval(() => {
      this.loadNotifications();
    }, 5000);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authenticationService.logout();
  }
}
