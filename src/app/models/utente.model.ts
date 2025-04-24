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
  repartoId?: number;
  nameDepartment?: string;
  countNotification?: number;
  keycloakId?: string;
}
