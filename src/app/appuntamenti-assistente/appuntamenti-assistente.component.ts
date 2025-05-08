import {Component, OnInit, ViewChild} from '@angular/core';
import {Appuntamento} from '../models/appuntamento.model';
import {AppuntamentoService} from '../services/appuntamento.service';
import {CalendarOptions, EventClickArg} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {Router} from '@angular/router';
import {FerieTurniService} from '../services/ferie-turni.service';
import {AuthenticationService} from '../auth/authenticationService';

@Component({
  selector: 'app-appuntamenti-assistente',
  standalone: false,
  templateUrl: './appuntamenti-assistente.component.html',
  styleUrl: './appuntamenti-assistente.component.css'
})
export class AppuntamentiAssistenteComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00'
  };

  appointments: Appuntamento[] = [];
  patients: any[] = [];
  startDate!: string;
  endDate!: string;



  constructor(
    private appuntamentoService: AppuntamentoService,
    private toastr: ToastrService,
    private router: Router,
    private ferieTurniService: FerieTurniService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  goBack(): void {
    this.router.navigate(['/assistente']);
  }

  private loadData(): void {
    this.appuntamentoService.getVeterinarianPatients().subscribe({
      next: (patients) => {
        console.log('Animali ricevuti:', patients);
        this.patients = patients;
        this.fetchAppointments();
      }
      ,
      error: () => {
        this.toastr.error('Errore caricando i pazienti.');
      }
    });

  }



  private fetchAppointments(): void {
    this.appuntamentoService.getAppointmentsForAssistant().subscribe({
      next: (appointments) => {
        console.log('Appuntamenti ricevuti:', appointments); // 👈 AGGIUNGI QUESTO
        this.appointments = appointments;
        this.loadFerieETurni();
      },
      error: () => {
        this.toastr.error('Errore caricando appuntamenti.');
      }
    });
  }


  richiediFerie(): void {
    if (!this.startDate || !this.endDate) {
      this.toastr.error('Inserisci una data di inizio e fine valida.');
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start >= end) {
      this.toastr.error('La data di fine deve essere successiva alla data di inizio.');
      return;
    }

    this.authService.getUserInfo().subscribe(user => {
      this.ferieTurniService.richiediFerie(this.startDate, this.endDate, user.id).subscribe({
        next: () => this.toastr.success('Richiesta ferie inviata.'),
        error: () => this.toastr.error('Errore durante la richiesta ferie.')
      });
    });
  }

  caricaTurni(): void {

    this.ferieTurniService.getTurniUtente().subscribe(turni => {
      const calendarApi = this.calendarComponent.getApi();
      turni.forEach(t => {
        calendarApi.addEvent({
          title: 'Turno assegnato',
          start: new Date(t.startTime),
          end: new Date(t.endTime),
          color: '#81c784'
        });
      });
    });
  }

  caricaFerie(): void {
    const oggi = new Date();
    const startDate = new Date(oggi.getFullYear(), oggi.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0).toISOString().split('T')[0];

    this.ferieTurniService.getFerieUtente(startDate, endDate).subscribe(ferie => {
      const calendarApi = this.calendarComponent.getApi();
      ferie.forEach(f => {
        calendarApi.addEvent({
          title: 'Ferie',
          start: new Date(f.startDate),
          end: new Date(f.endDate),
          color: '#f44336'
        });
      });
    });
  }



  loadFerieETurni(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();

    const oggi = new Date();
    const startDate = new Date(oggi.getFullYear(), oggi.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0).toISOString().split('T')[0];


    this.ferieTurniService.getFerieUtente(startDate, endDate).subscribe(ferie => {
      ferie
        .filter(f => !f.approvato)
        .forEach(f => {
          calendarApi.addEvent({
            title: 'Ferie richieste',
            start: f.startDate,
            end: f.endDate,
            color: '#ffcc80',
            textColor: '#000000'
          });
        });
    });


    this.ferieTurniService.getFerieApprovate(startDate, endDate).subscribe(ferie => {
      ferie.forEach(f => {
        calendarApi.addEvent({
          title: 'Ferie approvate',
          start: new Date(f.startDate),
          end: new Date(f.endDate),
          color: '#64b5f6',
          textColor: '#ffffff'
        });
      });
    });

    this.ferieTurniService.getTurniUtente().subscribe(turni => {
      turni.forEach(t => {
        calendarApi.addEvent({
          title: 'Turno',
          start: t.startDate,
          end: t.endDate,
          color: '#c8e6c9',
          textColor: '#000000'
        });
      });
    });
  }



  updateCalendarEvents(): void {
    if (!this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();

    const today = new Date();
    this.appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate || appointment.date);
      const nomeCliente = appointment.animal?.cliente?.firstName || 'Cliente';
      const cognomeCliente = appointment.animal?.cliente?.lastName || '';

      calendarApi.addEvent({
        id: appointment.id.toString(),
        title: `${nomeCliente} ${cognomeCliente}`,
        start: appointmentDate.toISOString(),
        color: appointmentDate < today ? '#81c784' : '#4fc3f7',
        textColor: '#000000'
      });
    });
  }





  handleDateClick(arg: DateClickArg): void {
    if (this.patients.length === 0) {
      this.toastr.error('Non ci sono pazienti disponibili.');
      return;
    }

    const animalOptions = this.patients.map(patient => {
      const veterinarianId = patient.veterinario?.id;
      return veterinarianId
        ? `<option value="${patient.id}" data-vetid="${veterinarianId}">${patient.name}</option>`
        : '';
    }).join('');

    Swal.fire({
      title: '<strong style="color: #1976d2;">Crea Appuntamento</strong>',
      background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
      html: `
      <input id="motivo" class="swal2-input" placeholder="Motivo" style="margin-bottom: 10px;">
      <input type="time" id="ora" class="swal2-input" style="margin-bottom: 10px;">
      <select id="animalId" class="swal2-select" style="margin-top: 10px;">
        <option value="">Seleziona un animale</option>
        ${animalOptions}
      </select>
    `,
      confirmButtonText: 'Crea',
      confirmButtonColor: '#43a047',
      focusConfirm: false,
      preConfirm: () => {
        const motivo = (document.getElementById('motivo') as HTMLInputElement).value.trim();
        const ora = (document.getElementById('ora') as HTMLInputElement).value.trim();
        const animaleSelect = document.getElementById('animalId') as HTMLSelectElement;
        const animaleId = animaleSelect.value;
        const selectedOption = animaleSelect.options[animaleSelect.selectedIndex];
        const veterinarianId = Number(selectedOption.getAttribute('data-vetid'));

        if (!motivo || !ora || !animaleId || isNaN(veterinarianId) || veterinarianId <= 0) {
          Swal.showValidationMessage('Compila tutti i campi e seleziona un animale valido!');
          return null;
        }

        return { motivo, ora, animaleId: Number(animaleId), veterinarianId };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { motivo, ora, animaleId, veterinarianId } = result.value;
        const giorno = arg.dateStr.split('T')[0];
        const oraCompleta = ora.length === 5 ? `${ora}:00` : ora;
        const fullDateTimeString = `${giorno}T${oraCompleta}`;

        this.appuntamentoService.createAppointment({
          animalId: animaleId,
          veterinarianId: veterinarianId,
          appointmentDate: fullDateTimeString,
          reason: motivo
        }).subscribe({
          next: (createdAppointment) => {
            this.toastr.success('Appuntamento creato!', 'Successo');
            this.appointments.push(createdAppointment);
            this.updateCalendarEvents();
          },
          error: () => {
            this.toastr.error('Errore nella creazione dell\'appuntamento.');
          }
        });
      }
    });
  }



  private handleEventClick(arg: EventClickArg): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Vuoi eliminare o rimandare questo appuntamento?",
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sì, elimina',
      denyButtonText: 'Rimanda',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#d33',
      denyButtonColor: '#1976d2',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAppointment(+arg.event.id);

      } else if (result.isDenied) {
        this.rescheduleAppointment(+arg.event.id);
      }
    });
  }

  deleteAppointment(id: number) {
    this.appuntamentoService.deleteAppointment(id)
      .subscribe({
        next: () => {
          this.toastr.success('Appuntamento eliminato.');
          this.appointments = this.appointments.filter(app => app.id !== +id);
          this.updateCalendarEvents();
        },
        error: () => {
          this.toastr.error('Errore nella cancellazione.');
        }
      });
  }

  rescheduleAppointment(id: number) {
    Swal.fire({
      title: 'Rimanda Appuntamento',
      html: `
      <input type="date" id="newDate" class="swal2-input">
      <input type="time" id="newTime" class="swal2-input">
    `,
      confirmButtonText: 'Rimanda',
      preConfirm: () => {
        const date = (document.getElementById('newDate') as HTMLInputElement).value;
        const time = (document.getElementById('newTime') as HTMLInputElement).value;
        if (!date || !time) {
          Swal.showValidationMessage('Inserisci data e ora');
          return null;
        }
        return { newDate: date, newTime: time };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const newDateTime = `${result.value.newDate}T${result.value.newTime}:00`;

        this.appuntamentoService.remindAppointment(id, newDateTime)
          .subscribe({
            next: () => {
              this.toastr.success('Appuntamento rimandato.');
              this.fetchAppointments();
            },
            error: () => {
              this.toastr.error('Errore nel rimandare l\'appuntamento.');
            }
          });
      }
    });
  }


}
