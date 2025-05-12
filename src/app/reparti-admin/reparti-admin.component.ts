import {Component, OnInit} from '@angular/core';
import {AdminService} from '../services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

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
  page: number = 1;
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];

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

  eliminaReparto(repartoId: number): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Il reparto e tutto il personale associato verranno eliminati!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00796b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, elimina!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteReparto(repartoId).subscribe({
          next: () => {
            this.toastr.success('Reparto eliminato con successo!');
            this.caricaReparti();
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Errore durante l\'eliminazione del reparto.');
          }
        });
      }
    });
  }

  goToPreviousPage(): void {
    if (this.page > 1) this.page--;
  }

  goToNextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.applyPagination();
  }

  get totalPages(): number {
    return Math.ceil(this.reparti.length / this.pageSize) || 1;
  }

  get paginatedReparti() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.reparti.slice(startIndex, endIndex);
  }

  applyPagination() {
    this.reparti = this.paginatedReparti;
  }


}
