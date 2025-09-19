export interface Puesto {
  id: number;
  puesto: PuestoType;
  label?: string
}

export interface Turno {
  id: number;
  turno: TurnoType;
  label?: string
}

export interface TareaResponse {
  id: number;
  descripcion: string;
  completada: boolean;
  fechaCompletada: string | null;
  fecha: string;
  tipoRecurrencia: RecurrenceType
  diaSemana: DiaSemana | null;
  diaMes: number | null;
  puesto: Puesto;
  turno: Turno;
}

export interface TareaApp {
  id: number;
  descripcion: string;
  completada: boolean;
  fechaCompletada: string | null;
  fecha: string;
  recurrencia: Recurrence
  diaSemana: DiaSemana | null;
  diaMes: number | null;
  puesto: Puesto;
  turno: Turno;
}

export interface CrearTareaRequest {
  puestoId: number;
  turnoId: number;
  descripcion: string;
  tipoRecurrencia: RecurrenceType
  diaSemana?: DiaSemana;
  diaMes?: number;
  fecha?: string;
}

export interface FiltroTareaRequest {
  turnoId?: number;
  puestoId?: number;
  tipoRecurrencia?: RecurrenceType
  diaSemana?: DiaSemana;
  completada?: boolean;
  fecha?: string;
}

export enum RecurrenceType {
  DIARIA = 'DIARIA',
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
  UNA_VEZ = 'UNA_VEZ'
}

export interface Recurrence {
  recurrenceType: RecurrenceType;
  label?: string;
}

export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO'
}

export interface DiaSemanaWithLabel {
  diaSemana: DiaSemana;
  label: string;
}

export enum PuestoType {
  ENCARGADO = 'ENCARGADO',
  COCINERO = 'COCINERO',
  CAMARERO = 'CAMARERO',
  PINCHE = 'PINCHE'
}

export enum TurnoType {
  MANANA = 'MANANA',
  MEDIO = 'MEDIO',
  TARDE = 'TARDE'
}

export interface LoginResponse {
  token: string;
  refreshToken: string,
  user: ProfileResponse
}

export interface ProfileResponse {
  username: string
  name: string
  isAdmin: boolean
  puesto: PuestoType
}

export interface UserResponse {
  id: number
  username: string
  nombre: string
  activo: boolean
  fechaCreacion: string
  fechaActualizacion: string
  puesto: string
  rol: string
  admin: boolean
}

export interface CrearUserRequest {
  username: string;
  password: string;
  nombre?: string | undefined;
  puestoId: number;
}

export interface AdminChangePasswordRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ErrorResponse {
  message: string,
  status: string,
  timestamp: string,
  details?: Record<string, string>;
}