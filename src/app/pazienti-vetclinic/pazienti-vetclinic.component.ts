import {Component, OnInit} from '@angular/core';
import {AdminService} from '../services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Medicine} from '../models/medicine.model';
import {Animale} from '../models/animale.model';

@Component({
  selector: 'app-pazienti-vetclinic',
  standalone: false,
  templateUrl: './pazienti-vetclinic.component.html',
  styleUrl: './pazienti-vetclinic.component.css'
})
export class PazientiVetclinicComponent implements OnInit {
  animali: any[] = [];
  reparti: any[] = [];

  mostraTabella: boolean = false;
  filteredAnimali: Animale[] = [];
  mostraForm: boolean = false;
  page: number = 1;
  originalAnimali: any[] = [];
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];



  searchKeyword: string = '';
  nuovoAnimale = {
    nome: '',
    specie: '',
    razza: '',
    peso: null,
    repartoId: '',
    clienteNome: '',
    clienteCognome: '',
    clienteEmail: '',
    clienteUsername: ''
  };

  constructor(private adminService: AdminService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.caricaDati();
  }


  goBack(): void {
    this.router.navigate(['/admin']);
  }



  applyAnimalFilters(): void {
    const term = this.searchKeyword.toLowerCase();

    this.animali = this.originalAnimali.filter(a =>
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.species && a.species.toLowerCase().includes(term)) ||
      (a.cliente?.email && a.cliente.email.toLowerCase().includes(term)) ||
      (a.reparto?.name && a.reparto.name.toLowerCase().includes(term))
    );
  }

  searchAnimali(): void {
    this.applyAnimalFilters();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.page = 1;
    this.caricaDati();
  }


  caricaDati(): void {
    this.adminService.getAllAnimals().subscribe(data => {
      this.animali = data;
      this.originalAnimali = [...data];
    });

    this.adminService.getAllDepartments().subscribe(data => {
      this.reparti = data;
    });
  }


  aggiungiAnimale(): void {
    const { nome, specie, razza, peso, repartoId, clienteNome, clienteCognome, clienteEmail, clienteUsername } = this.nuovoAnimale;

    if (!nome || !specie || !razza || !peso || !repartoId || !clienteNome || !clienteEmail || !clienteUsername) {
      this.toastr.error("Compila tutti i campi.");
      return;
    }

    const payload = {
      nomeAnimale: nome,
      specie,
      razza,
      peso,
      repartoId: Number(repartoId),
      clienteNome,
      clienteCognome,
      clienteEmail
    };


    this.adminService.addAnimalWithClient(payload).subscribe({
      next: () => {
        this.toastr.success("Paziente registrato!");
        this.caricaDati();
        this.mostraForm = false;
      },
      error: () => this.toastr.error("Errore nella registrazione.")
    });
  }

  search(): void {
    const term = this.searchKeyword.toLowerCase();
    this.adminService.getAllAnimals().subscribe(data => {
      this.animali = data.filter(a =>
        a.nome.toLowerCase().includes(term) ||
        a.specie.toLowerCase().includes(term) ||
        a.cliente.email.toLowerCase().includes(term)
      );
    });
  }

  eliminaAnimale(id: number): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Il paziente verrà eliminato in modo permanente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00796b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, elimina!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAnimal(id).subscribe({
          next: () => {
            this.toastr.success('Animale eliminato con successo!');
            this.caricaDati();
          },
          error: (err) => {
            console.error(err);
            this.toastr.error("Errore durante l'eliminazione del paziente.");
          }
        });
      }
    });
  }



  reset(): void {
    this.searchKeyword = '';
    this.caricaDati();
  }

  goToPreviousPage(): void { if (this.page > 1) this.page--; }
  goToNextPage(): void { if (this.page < this.totalPages) this.page++; }
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.applyAnimalFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAnimali.length / this.pageSize) || 1;
  }
}

