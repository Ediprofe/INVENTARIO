/**
 * Zod schemas para validación de ítems de inventario - según CLAUDE.md.
 */
import { z } from 'zod';

export const itemSchema = z.object({
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
    .positive('Debe seleccionar un responsable')
    .optional()
    .nullable(),
  placa: z
    .string()
    .max(100, 'La placa no puede exceder 100 caracteres')
    .optional(),
  marca: z
    .string()
    .max(100, 'La marca no puede exceder 100 caracteres')
    .optional(),
  serial: z
    .string()
    .max(100, 'El serial no puede exceder 100 caracteres')
    .optional(),
  estado: z.enum(['bueno', 'regular', 'malo'], {
    message: 'El estado físico es requerido',
  }),
  disponibilidad: z.enum(['en_uso', 'en_reparacion', 'extraviado', 'de_baja'], {
    message: 'La disponibilidad es requerida',
  }),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  observaciones: z.string().max(1000, 'Las observaciones no pueden exceder 1000 caracteres').optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
