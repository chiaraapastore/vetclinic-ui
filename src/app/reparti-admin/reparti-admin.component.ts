import {Component, OnInit} from '@angular/core';
import {AdminService} from '../services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reparti-admin',
  standalone: false,
  templateUrl: './reparti-admin.component.html',
  styleUrl: './reparti-admin.component.css'
})
export class RepartiAdminComponent implements OnInit {
  reparti: any[] = [];
  capoReparti: any[] = [];
  mostraTabella = false;
  mostraForm = false;
  searchKeyword = '';
  originalReparti: any[] = [];

  nuovoReparto = {
    repartoNome: '',
    capoReparto: {
      nome: '', cognome: '', email: '', username: ''
    },
    assistente: {
      nome: '', cognome: '', email: '', username: ''
    },
    veterinario: {
      nome: '', cognome: '', email: '', username: ''
    }
  };

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaReparti();
    this.adminService.getAllDepartments().subscribe(departments => {
      this.reparti = departments;
      this.adminService.getHeadOfDepartments().subscribe(capi => {
        this.capoReparti = capi;


        for (let reparto of this.reparti) {
          const capo = this.capoReparti.find(c => c.reparto && c.reparto.id === reparto.id);
          reparto.headOfDepartment = capo || null;
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  caricaReparti(): void {
    this.adminService.getAllDepartments().subscribe(data => {
      this.reparti = data;
      this.originalReparti = [...data];
    });
  }

  searchReparti(): void {
    const term = this.searchKeyword.toLowerCase();
    this.reparti = this.originalReparti.filter(r =>
      r.name?.toLowerCase().includes(term)
    );
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.caricaReparti();
  }

  creaReparto(): void {
    const payload = this.nuovoReparto;

    if (!payload.repartoNome ||
      !payload.capoReparto.email ||
      !payload.assistente.email ||
      !payload.veterinario.email) {
      this.toastr.error("Compila tutti i campi obbligatori.");
      return;
    }

    this.adminService.createDepartmentWithStaff(payload).subscribe({
      next: () => {
        this.toastr.success("Reparto creato con successo!");
        this.mostraForm = false;
        this.caricaReparti();
      },
      error: () => this.toastr.error("Errore nella creazione del reparto.")
    });
  }
}
