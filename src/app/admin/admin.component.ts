import {Component, HostListener, OnInit} from '@angular/core';
import {VeterinarioService} from '../services/veterinario.service';
import {AuthenticationService} from '../auth/authenticationService';
import {SomministrazioneService} from '../services/somministrazione.service';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {AppuntamentoService} from '../services/appuntamento.service';
import {NotificheService} from '../services/notifiche.service';
import {CapoRepartoService} from '../services/capo-reparto.service';
import {ToastrService} from 'ngx-toastr';
import {Appuntamento} from '../models/appuntamento.model';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
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
  feriePendenti: any[] = [];

  ordini: any[] = [];
  richiesteAppuntamenti: any[] = [];
  repartoId!: number;
  appointments: Appuntamento[] = [];
  adminUsername: string = '';

  constructor(
    private doctorService: VeterinarioService,
    public authenticationService: AuthenticationService,
    private somministrazioneService: SomministrazioneService,
    private router: Router,
    private keycloakService: KeycloakService,
    private appuntamentoService: AppuntamentoService,
    private notificationService: NotificheService,
    private headOfDepartmentService: CapoRepartoService,
    private toastr: ToastrService,
    private adminService: AdminService,

  ) {}

  ngOnInit() {
    this.caricaDottori();
    this.getAdminUsername();
    this.listenForNewNotifications();
    this.caricaOrdini();
    // this.loadAttivitaRecenti();

    this.caricaFeriePendenti();
    this.loadReparti();
  }

  caricaDottori() {
    if (!this.selectedRepartoId) return;
    this.doctorService.getVeterinariByDepartment(this.selectedRepartoId).subscribe((data: any[]) => {
      this.dottori = data;
    });
  }

  loadReparti(): void {
    this.adminService.getAllDepartments().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  async getAdminUsername() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        this.adminUsername = userProfile.username || 'Admin';
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



  caricaOrdini() {
    this.adminService.getOrderHistory().subscribe((data: any[]) => {
      this.ordini = data;
    });
  }


  rimuoviRichiesta(id: number) {
    this.richiesteAppuntamenti = this.richiesteAppuntamenti.filter(r => r.id !== id);
    this.attivitaRecenti = this.attivitaRecenti.filter(a => a.id !== id);
    this.sortAttivita();
  }

  sortAttivita() {
    this.attivitaRecenti.sort((a, b) => b.orario.localeCompare(a.orario));
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

  caricaFeriePendenti() {
    this.authenticationService.getUserInfo().subscribe(user => {
      const repartoId = user?.repartoId;
      if (!repartoId) return;

      this.headOfDepartmentService.getFerieNonApprovate(repartoId).subscribe({
        next: (res) => {
          console.log('Ferie ricevute:', res);
          this.feriePendenti = res.ferie;
        }
      });
    });
  }






}
