'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingBatchEditButtonProps {
  selectedCount: number;
  onClick: () => void;
  className?: string;
}

/**
 * Botón flotante para edición rápida de ítems.
 * 
 * Aparece solo cuando hay ítems seleccionados y flota en la esquina inferior derecha
 * de la pantalla, sin superponerse a otros elementos críticos.
 */
export function FloatingBatchEditButton({ 
  selectedCount, 
  onClick, 
  className 
}: FloatingBatchEditButtonProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
      "animate-in slide-in-from-bottom-5",
      className
    )}>
      <Button
        size="lg"
        onClick={onClick}
        className="shadow-lg hover:shadow-xl transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar Rápido ({selectedCount})
      </Button>
    </div>
  );
}

