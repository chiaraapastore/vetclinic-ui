import {Reparto} from './reparto.model';


export interface Utente {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password?: string;
  profileImage?: string;
  registrationNumber?: string;
  role: 'admin' | 'capo-reparto' | 'assistente' | 'veterinario' | 'cliente';
  reparto?: Reparto;
  countNotification?: number;
  keycloakId?: string;
}
