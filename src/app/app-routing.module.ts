
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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'capo-reparto', component: CapoRepartoComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'veterinario', component: VeterinarioComponent, canActivate: [AuthGuard], data: { roles: ['veterinario'] } },
  { path: 'assistente', component: AssistenteComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard], data: { roles: ['cliente'] } },
  {path: 'pazienti', component: PazientiAnimaliComponent, canActivate: [AuthGuard], data: { roles: ['assistente', 'veterinario'] } },
  {path: 'appuntamenti', component: AppuntamentiAssistenteComponent, canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  {path: 'pagamenti', component: PagamentiComponent,canActivate: [AuthGuard], data: { roles: ['assistente'] } },
  { path: 'profile', component: ProfiloComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
