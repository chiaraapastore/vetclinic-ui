
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import {AdminComponent} from './admin/admin.component';
import {AuthGuard} from './guards/auth.guard';
import {CapoRepartoComponent} from './capo-reparto/capo-reparto.component';
import {VeterinarioComponent} from './veterinario/veterinario.component';
import {AssistenteComponent} from './assistente/assistente.component';
import {ClienteComponent} from './cliente/cliente.component';
import {ProfiloComponent} from './profilo/profilo.component';
import {PazientiAnimaliComponent} from './pazienti-animali/pazienti-animali.component';
import {AppuntamentiAssistenteComponent} from './appuntamenti-assistente/appuntamenti-assistente.component';
import {PagamentiComponent} from './pagamenti/pagamenti.component';
import {SomministrazioniComponent} from './somministrazioni/somministrazioni.component';
import {MagazzinoAssistenteComponent} from './magazzino-assistente/magazzino-assistente.component';
import {ProfiloVeterinarioComponent} from './profilo-veterinario/profilo-vetterinario.component';
import {
  PazientiAnimaliVeterinarioComponent
} from './pazienti-animali-veterinario/pazienti-animali-veterinario.component';
import {
  SomministrazioneVeterinarioComponent
} from './somministrazione-veterinario/somministrazione-veterinario.component';
import {AppuntamentiVeterinarioComponent} from './appuntamenti-veterinario/appuntamenti-veterinario.component';
import {ProfiloCapoRepartoComponent} from './profilo-capo-reparto/profilo-capo-reparto.component';
import {MagazzinoCapoRepartoComponent} from './magazzino-capo-reparto/magazzino-capo-reparto.component';
import {PersonaleRepartoComponent} from './personale-reparto/personale-reparto.component';
import {
  PazientiAnimaliCapoRepartoComponent
} from './pazienti-animali-capo-reparto/pazienti-animali-capo-reparto.component';
import {ProfiloClienteComponent} from './profilo-cliente/profilo-cliente.component';
import {AnimaliClienteComponent} from './animali-cliente/animali-cliente.component';
import {PagamentiClienteComponent} from './pagamenti-cliente/pagamenti-cliente.component';
import {AppuntamentiClienteComponent} from './appuntamenti-cliente/appuntamenti-cliente.component';
import {ProfiloAdminComponent} from './profilo-admin/profilo-admin.component';
import {PersonaleVetclinicComponent} from './personale-vetclinic/personale-vetclinic.component';
import {PazientiVetclinicComponent} from './pazienti-vetclinic/pazienti-vetclinic.component';
import {RepartiAdminComponent} from './reparti-admin/reparti-admin.component';
import {DatiStatisticheComponent} from './dati-statistiche/dati-statistiche.component';
import {MagazzinoAdminComponent} from './magazzino-admin/magazzino-admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'capo-reparto', component: CapoRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'veterinario', component: VeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  { path: 'assistente', component: AssistenteComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  {path: 'pazienti', component: PazientiAnimaliComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  {path: 'appuntamenti-assistente', component: AppuntamentiAssistenteComponent, canActivate: [AuthGuard], data: { roles: ['assistente', 'veterinario'] } },
  {path: 'pagamenti', component: PagamentiComponent,canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  {path: 'somministrazioni', component: SomministrazioniComponent, canActivate: [AuthGuard], data: { roles: ['assistente', 'veterinario'] } },
  {path: 'magazzino-assistente', component:MagazzinoAssistenteComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  {path: 'magazzino-capo-reparto', component:MagazzinoCapoRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'profile', component: ProfiloComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  { path: 'profilo-veterinario', component: ProfiloVeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  { path: 'profilo-capo-reparto', component: ProfiloCapoRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  {path: 'pazienti-animali-veterinario', component: PazientiAnimaliVeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  {path: 'somministrazione-veterinario', component: SomministrazioneVeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  {path: 'appuntamenti-veterinario', component: AppuntamentiVeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  { path: 'personale-reparto', component: PersonaleRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  {path: 'pazienti-animali-capo-reparto', component: PazientiAnimaliCapoRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  {path: 'animali-cliente', component: AnimaliClienteComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  {path: 'pagamenti-cliente', component: PagamentiClienteComponent,canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  { path: 'profilo-cliente', component: ProfiloClienteComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  {path: 'appuntamenti-cliente', component: AppuntamentiClienteComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  { path: 'profile-admin', component: ProfiloAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'personale-vetclinic', component: PersonaleVetclinicComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'pazienti-vetclinic', component: PazientiVetclinicComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'reparti-admin', component: RepartiAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'dati-statistiche', component: DatiStatisticheComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'magazzino-admin', component: MagazzinoAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
