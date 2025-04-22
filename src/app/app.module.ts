import { NgModule, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AdminComponent } from './admin/admin.component';
import { AssistenteComponent } from './assistente/assistente.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CapoRepartoComponent } from './capo-reparto/capo-reparto.component';
import { VeterinarioComponent } from './veterinario/veterinario.component';

export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak
        .init({
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
        .then(() => {
          console.log('Keycloak inizializzato con successo');
        })
        .catch((err) => {
          console.error('Errore inizializzazione Keycloak:', err);
        })
      : Promise.resolve();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    AdminComponent,
    AssistenteComponent,
    ClienteComponent,
    CapoRepartoComponent,
    VeterinarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    CommonModule,
    ToastrModule.forRoot({
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      timeOut: 4000,
      closeButton: true,
      progressBar: true,
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
export class AppModule { }
