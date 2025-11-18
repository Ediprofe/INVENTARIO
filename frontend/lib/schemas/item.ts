/**
 * Zod schemas para validación de ítems de inventario.
 */
import { z } from 'zod';

export const itemSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'El código solo puede contener mayúsculas, números y guiones'),
  articulo_id: z
    .number({
      message: 'El artículo es requerido',
    })
    .int('Debe ser un número entero')
    .positive('Debe seleccionar un artículo'),
  ubicacion_id: z
    .number({
      message: 'La ubicación es requerida',
    })
    .int('Debe ser un número entero')
    .positive('Debe seleccionar una ubicación'),
  responsable_id: z
    .number({
      message: 'El responsable es requerido',
    })
    .int('Debe ser un número entero')
    .positive('Debe seleccionar un responsable'),
  cantidad: z
    .number({
      message: 'La cantidad es requerida',
    })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1')
    .max(9999, 'La cantidad máxima es 9999'),
  valor_unitario: z
    .number({
      message: 'El valor unitario es requerido',
    })
    .min(0, 'El valor unitario debe ser mayor o igual a 0'),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento', 'dado_baja', 'extraviado', 'reparacion'], {
    message: 'El estado es requerido',
  }),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  observaciones: z.string().max(1000, 'Las observaciones no pueden exceder 1000 caracteres').optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
