/**
 * Zod schemas para validación de autenticación.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido')
    .max(150, 'El nombre de usuario no puede exceder 150 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
