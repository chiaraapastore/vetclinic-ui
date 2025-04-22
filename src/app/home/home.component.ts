import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, Event} from '@angular/router';
import {AuthenticationService} from "../auth/authenticationService";
import {KeycloakService} from "keycloak-angular";
import {filter} from "rxjs";
import {UtenteService} from "../services/utente.service";

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userDetails: any;
  isLoggedIn: boolean = false;

  constructor(
      private router: Router,
      private authService: AuthenticationService,
      private keycloakService: KeycloakService,
      private utenteService: UtenteService
  ) {

    this.router.events
        .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
        });
  }

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    console.log(" Stato login:", this.isLoggedIn);

    if (this.isLoggedIn) {
      this.getUserDetails();
      this.logUserRoles();
      await this.authService.redirectUserByRole();
    }
  }

  async goToUserProfile(): Promise<void> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const roles = this.keycloakService.getUserRoles();

        if (roles.includes('admin')) {
          await this.router.navigate(['/admin']);
        } else if (roles.includes('assistente')) {
          await this.router.navigate(['/assistente']);
        } else if (roles.includes('cliente')) {
          await this.router.navigate(['/cliente']);
        } else if (roles.includes('capo-reparto')) {
          await this.router.navigate(['/capo-reparto']);
        }else if (roles.includes('veterinario')) {
        await this.router.navigate(['/veterinario']);
        } else {
          console.warn("Ruolo sconosciuto:", roles);
          await this.router.navigate(['/error']);
        }
      } else {
        await this.keycloakService.login();
      }
    } catch (error) {
      console.error("Errore durante la navigazione:", error);
    }
  }


  private logUserRoles(): void {
    const roles = this.keycloakService.getUserRoles();
    console.log('Ruoli utente attuali:', roles);
  }



  private getUserDetails(): void {
    const keycloak = this.keycloakService.getKeycloakInstance();
    this.userDetails = {
      email: keycloak.tokenParsed?.['email'],
      username: keycloak.tokenParsed?.['preferred_username'],
      firstName: keycloak.tokenParsed?.['given_name'],
      lastName: keycloak.tokenParsed?.['family_name'],
      keycloakId: keycloak.tokenParsed?.sub,
    };


    this.utenteService.checkUserExists(this.userDetails.username).subscribe({
      next: (exists: any) => {
        if (!exists) {
          this.saveUserToBackend(this.userDetails);
        } else {
          console.log('Utente già esistente nel backend.');
        }
      },
      error: (error: any) => {
        console.error('Errore durante il controllo dell\'utente:', error);
      }
    });
  }

  private saveUserToBackend(userDetails: any): void {
    this.utenteService.createUser(userDetails).subscribe({
      next: (response: any) => {
        console.log('Utente creato con successo:', response);
      },
      error: (error: { status: number; }) => {
        if (error.status === 409) {
          console.log('Utente già esistente nel backend.');
        } else {
          console.error('Errore nella creazione dell\'utente:', error);
        }
      }
    });
  }


  testimonials = [
    { text: 'Finalmente un\'app pensata davvero per noi! Gestire i pazienti, i trattamenti e la documentazione clinica è diventato semplice e veloce. Non potrei più farne a meno!', author: 'Sara B.' },
    { text: 'Da quando usiamo questa piattaforma, abbiamo ridotto del 40% gli errori di gestione e migliorato l\'organizzazione interna. Intuitiva, sicura e completa.', author: 'Marco L.' },
    { text: 'Poter consultare la storia clinica del mio cane direttamente online è fantastico! Mi sento più seguito e ho tutte le informazioni sempre a portata di mano.', author: 'Anna R.' },
    { text: 'Con il sistema di notifiche e il monitoraggio dei farmaci, abbiamo migliorato tantissimo l\'efficienza del nostro reparto. Ogni dottore ha esattamente ciò che serve al momento giusto.', author: 'Laura P.' },
    { text: 'L\'app ci permette di aggiornare visite e somministrazioni in tempo reale. È facilissima da usare anche durante le giornate più impegnative!', author: 'Davide M.' },
    { text: 'Gestisco due cani e un gatto. Grazie all\'app posso prenotare le visite, monitorare i trattamenti e ricevere promemoria. Una rivoluzione!', author: 'Luca N.' }
  ];


  scrollIndex = 0;
  testimonialsPerPage = 3;


  get visibleTestimonials() {
    return this.testimonials.slice(this.scrollIndex, this.scrollIndex + this.testimonialsPerPage);
  }

  scrollCarousel(direction: number) {
    const maxScrollIndex = Math.max(0, this.testimonials.length - this.testimonialsPerPage);

    this.scrollIndex += direction * this.testimonialsPerPage;

    if (this.scrollIndex < 0) {
      this.scrollIndex = maxScrollIndex;
    } else if (this.scrollIndex > maxScrollIndex) {
      this.scrollIndex = 0;
    }
  }

}
