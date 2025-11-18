/**
 * Types centralizados para el sistema de inventario.
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  cargo: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export interface IRefreshRequest {
  refresh: string;
}

export interface IRefreshResponse {
  access: string;
}

// ============================================================================
// Entity Types
// ============================================================================

export interface ISede {
  id: number;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
  total_ubicaciones: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IUbicacion {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  sede: ISede;
  piso: number | null;
  capacidad: number | null;
  observaciones: string;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IResponsable {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  tipo_documento: string;
  documento: string;
  cargo: string;
  email: string;
  telefono: string;
  sede: ISede;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IArticulo {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  foto: string | null;
  activo: boolean;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface IItem {
  id: number;
  codigo: string;
  placa: string | null;
  articulo: IArticulo;
  sede: ISede;
  ubicacion: IUbicacion;
  responsable: IResponsable;
  marca: string;
  serial: string;
  estado: EstadoFisico;
  disponibilidad: Disponibilidad;
  descripcion: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

export interface IItemList {
  id: number;
  codigo: string;
  placa: string | null;
  articulo_nombre: string;
  ubicacion_nombre: string;
  ubicacion_descripcion: string;
  sede_nombre: string;
  responsable_nombre: string;
  marca: string;
  serial: string;
  estado: EstadoFisico;
  disponibilidad: Disponibilidad;
  descripcion: string;
  observaciones: string;
  created_at: string;
}

export interface IHistorialMovimiento {
  id: number;
  item: number;
  tipo_movimiento: string;
  usuario_nombre: string;
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  observaciones: string;
  created_at: string;
}

// ============================================================================
// Form Data Types (para create/update)
// ============================================================================

export interface IItemCreateData {
  articulo_id: number;
  ubicacion_id: number;
  responsable_id?: number | null;
  placa?: string;
  marca?: string;
  serial?: string;
  estado: EstadoFisico;
  disponibilidad: Disponibilidad;
  descripcion?: string;
  observaciones?: string;
}

export interface IItemUpdateData extends Partial<IItemCreateData> {}

export interface IBatchUpdateItem {
  id: number;
  ubicacion_id?: number;
  responsable_id?: number;
  estado?: EstadoFisico;
  disponibilidad?: Disponibilidad;
  placa?: string;
  marca?: string;
  serial?: string;
  descripcion?: string;
  observaciones?: string;
}

export interface IBatchUpdateRequest {
  items: IBatchUpdateItem[];
  atomic?: boolean;
}

export interface IBatchUpdateResponse {
  success: number[];
  errors: Array<{
    id: number;
    error: string;
  }>;
}

// ============================================================================
// Enums
// ============================================================================

export type EstadoFisico =
  | 'bueno'
  | 'regular'
  | 'malo';

export type Disponibilidad =
  | 'en_uso'
  | 'en_reparacion'
  | 'extraviado'
  | 'de_baja';

export type TipoUbicacion =
  | 'aula'
  | 'laboratorio'
  | 'oficina'
  | 'biblioteca'
  | 'deposito'
  | 'auditorio'
  | 'salon_multiple'
  | 'otro';

export type CategoriaArticulo =
  | 'tecnologia'
  | 'mobiliario'
  | 'laboratorio'
  | 'deportes'
  | 'audiovisual'
  | 'libros'
  | 'herramientas'
  | 'vehiculos'
  | 'otros';

export type TipoDocumento = 'cc' | 'ti' | 'ce' | 'pas' | 'nit';

// ============================================================================
// API Response Types
// ============================================================================

export interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IApiError {
  detail?: string;
  [key: string]: unknown;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface IItemFilters {
  page?: number;
  page_size?: number;
  search?: string;
  sede?: number;
  ubicacion?: number;
  responsable?: number;
  articulo?: number;
  estado?: EstadoFisico;
  disponibilidad?: Disponibilidad;
  placa?: string;
  marca?: string;
  serial?: string;
  created_after?: string;
  created_before?: string;
  ordering?: string;
}

export interface ISedeFilters {
  page?: number;
  page_size?: number;
  search?: string;
  activo?: boolean;
  ordering?: string;
}

export interface IUbicacionFilters {
  page?: number;
  page_size?: number;
  search?: string;
  sede?: number;
  tipo?: TipoUbicacion;
  activo?: boolean;
  ordering?: string;
}

export interface IResponsableFilters {
  page?: number;
  page_size?: number;
  search?: string;
  sede?: number;
  activo?: boolean;
  ordering?: string;
}

export interface IArticuloFilters {
  page?: number;
  page_size?: number;
  search?: string;
  categoria?: CategoriaArticulo;
  activo?: boolean;
  ordering?: string;
}
