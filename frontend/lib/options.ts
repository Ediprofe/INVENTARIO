/**
 * Utilidades para formatear opciones de estado y disponibilidad.
 * Centraliza la lógica de formateo para mantener consistencia.
 */

/**
 * Formatea un valor de opción a label legible.
 * Convierte snake_case a Title Case.
 * @example formatOptionLabel('en_uso') => 'En uso'
 * @example formatOptionLabel('bueno') => 'Bueno'
 */
export function formatOptionLabel(value: string): string {
  if (!value) return 'Sin asignar';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Convierte un array de strings a opciones {value, label}.
 * Usado para transformar la respuesta del endpoint /filter-options/
 */
export function toSelectOptions(values: string[] = []): Array<{ value: string; label: string }> {
  return values.map((value) => ({
    value,
    label: formatOptionLabel(value),
  }));
}

/**
 * Opciones por defecto para cuando el backend no responde.
 * Solo usar como fallback, preferir siempre datos dinámicos del backend.
 */
export const DEFAULT_ESTADO_OPTIONS = [
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
];

export const DEFAULT_DISPONIBILIDAD_OPTIONS = [
  { value: 'en_uso', label: 'En uso' },
  { value: 'en_reparacion', label: 'En reparación' },
  { value: 'extraviado', label: 'Extraviado' },
  { value: 'de_baja', label: 'De baja' },
];

/**
 * Retorna el estilo CSS apropiado para un estado dado.
 * Maneja estados desconocidos de forma segura.
 */
export function getEstadoVariant(estado: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const estadoLower = estado?.toLowerCase() || '';
  if (estadoLower === 'bueno') return 'default';
  if (estadoLower === 'regular') return 'secondary';
  if (estadoLower === 'malo') return 'destructive';
  return 'outline'; // Estado desconocido
}

/**
 * Retorna el estilo CSS apropiado para una disponibilidad dada.
 * Maneja disponibilidades desconocidas de forma segura.
 */
export function getDisponibilidadVariant(disponibilidad: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const dispLower = disponibilidad?.toLowerCase() || '';
  if (dispLower === 'en_uso') return 'default';
  if (dispLower === 'en_reparacion') return 'secondary';
  if (dispLower === 'extraviado' || dispLower === 'de_baja') return 'destructive';
  return 'outline'; // Disponibilidad desconocida
}
