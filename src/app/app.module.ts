import { NgModule, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AdminComponent } from './admin/admin.component';
import { AssistenteComponent } from './assistente/assistente.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CapoRepartoComponent } from './capo-reparto/capo-reparto.component';
import { VeterinarioComponent } from './veterinario/veterinario.component';
import { ProfiloComponent } from './profilo/profilo.component';
import { PazientiAnimaliComponent } from './pazienti-animali/pazienti-animali.component';
import { AppuntamentiAssistenteComponent } from './appuntamenti-assistente/appuntamenti-assistente.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PagamentiComponent } from './pagamenti/pagamenti.component';
import { SomministrazioniComponent } from './somministrazioni/somministrazioni.component';
import { MagazzinoAssistenteComponent } from './magazzino-assistente/magazzino-assistente.component';
import { ProfiloVeterinarioComponent } from './profilo-veterinario/profilo-vetterinario.component';
import { PazientiAnimaliVeterinarioComponent } from './pazienti-animali-veterinario/pazienti-animali-veterinario.component';
import { SomministrazioneVeterinarioComponent } from './somministrazione-veterinario/somministrazione-veterinario.component';
import { AppuntamentiVeterinarioComponent } from './appuntamenti-veterinario/appuntamenti-veterinario.component';
import { ProfiloCapoRepartoComponent } from './profilo-capo-reparto/profilo-capo-reparto.component';
import { MagazzinoCapoRepartoComponent } from './magazzino-capo-reparto/magazzino-capo-reparto.component';
import { PersonaleRepartoComponent } from './personale-reparto/personale-reparto.component';
import { PazientiAnimaliCapoRepartoComponent } from './pazienti-animali-capo-reparto/pazienti-animali-capo-reparto.component';
import { ProfiloClienteComponent } from './profilo-cliente/profilo-cliente.component';
import { AnimaliClienteComponent } from './animali-cliente/animali-cliente.component';
import { PagamentiClienteComponent } from './pagamenti-cliente/pagamenti-cliente.component';

export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'vetclinic-realm',
          clientId: 'vetclinic-app',
        },
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
        },
      })
      : Promise.resolve();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfiloComponent,
    AdminComponent,
    ClienteComponent,
    CapoRepartoComponent,
    AssistenteComponent,
    PagamentiComponent,
    MagazzinoAssistenteComponent,
    VeterinarioComponent,
    SomministrazioniComponent,
    ErrorComponent,
    AppuntamentiAssistenteComponent,
    ProfiloVeterinarioComponent,
    PazientiAnimaliComponent,
    PazientiAnimaliVeterinarioComponent,
    SomministrazioneVeterinarioComponent,
    AppuntamentiVeterinarioComponent,
    ProfiloCapoRepartoComponent,
    MagazzinoCapoRepartoComponent,
    PersonaleRepartoComponent,
    PazientiAnimaliCapoRepartoComponent,
    ProfiloClienteComponent,
    AnimaliClienteComponent,
    PagamentiClienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
      easeTime: 300,
      tapToDismiss: true,
      newestOnTop: true
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
