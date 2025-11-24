'use client';

import { useState, useRef } from 'react';
import { useResetImport, useDownloadResetTemplate } from '@/lib/hooks';
import type { ResetImportResult } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert } from '@/components/ui/alert';

interface ResetImportDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog para resetear e importar inventario completo desde Excel multi-hoja.
 * 
 * Características:
 * - Elimina todo el inventario existente
 * - Importa desde archivo Excel con 5 hojas (Sedes, Ubicaciones, Artículos, Responsables, Items)
 * - Proceso transaccional (todo o nada)
 * - Muestra estadísticas detalladas del proceso
 * - Permite descargar plantilla con datos de ejemplo
 */
export function ResetImportDialog({ open, onClose }: ResetImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResetImportResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetImportMutation = useResetImport();
  const downloadTemplateMutation = useDownloadResetTemplate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setShowConfirmation(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync();
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const handleRequestImport = () => {
    if (!selectedFile) return;
    setShowConfirmation(true);
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    try {
      const importResult = await resetImportMutation.mutateAsync(selectedFile);
      setResult(importResult);
      setSelectedFile(null);
      setShowConfirmation(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing:', error);
      setResult({
        success: false,
        stats: {
          items_eliminados: 0,
          items_creados: 0,
          sedes_creadas: 0,
          ubicaciones_creadas: 0,
          articulos_creados: 0,
          responsables_creados: 0,
        },
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
      });
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResult(null);
    setShowConfirmation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Resetear e Importar Inventario Completo</DialogTitle>
          <DialogDescription className="text-base">
            Esta operación <span className="font-bold text-red-600">eliminará todos los ítems</span> del inventario
            actual e importará los nuevos datos desde el archivo Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Alert */}
          <Alert variant="destructive" className="border-red-500 bg-red-50">
            <div className="space-y-2">
              <p className="font-semibold text-red-800">⚠️ Advertencia Importante</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Esta acción <strong>NO se puede deshacer</strong></li>
                <li>Se eliminarán <strong>TODOS</strong> los ítems del inventario actual</li>
                <li>El proceso es transaccional: si algo falla, no se realizan cambios</li>
                <li>Asegúrate de tener una copia de seguridad antes de continuar</li>
              </ul>
            </div>
          </Alert>

          {/* Instructions */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900">📋 Instrucciones</h3>
            <ol className="text-sm text-blue-800 list-decimal list-inside space-y-2">
              <li>Descarga la plantilla Excel haciendo clic en el botón &quot;Descargar Plantilla&quot;</li>
              <li>Llena las 5 hojas del archivo:
                <ul className="ml-6 mt-1 list-disc space-y-1">
                  <li><strong>Sedes:</strong> Catálogo de sedes</li>
                  <li><strong>Ubicaciones:</strong> Catálogo de ubicaciones</li>
                  <li><strong>Artículos:</strong> Catálogo de artículos</li>
                  <li><strong>Responsables:</strong> Catálogo de responsables</li>
                  <li><strong>Items:</strong> Datos del inventario (usa solo nombres, no códigos)</li>
                </ul>
              </li>
              <li>La plantilla incluye 10 registros de ejemplo en cada hoja como guía</li>
              <li>Sube el archivo completado y confirma la importación</li>
            </ol>
          </div>

          {/* Download Template Button */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isPending}
              className="w-full"
            >
              {downloadTemplateMutation.isPending ? 'Descargando...' : '📥 Descargar Plantilla'}
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="reset-file" className="text-base font-semibold">
              Archivo Excel Multi-hoja
            </Label>
            <Input
              id="reset-file"
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={resetImportMutation.isPending || showConfirmation}
            />
            <p className="text-sm text-gray-500">
              Formato aceptado: .xlsx (debe contener las 5 hojas requeridas)
            </p>
          </div>

          {/* Confirmation Step */}
          {showConfirmation && (
            <Alert variant="destructive" className="border-yellow-500 bg-yellow-50">
              <div className="space-y-3">
                <p className="font-semibold text-yellow-900">
                  🔔 ¿Estás seguro de que deseas continuar?
                </p>
                <p className="text-sm text-yellow-800">
                  Archivo seleccionado: <strong>{selectedFile?.name}</strong>
                </p>
                <p className="text-sm text-yellow-800">
                  Esta operación eliminará todos los ítems existentes y cargará los nuevos desde el archivo.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleConfirmImport}
                    disabled={resetImportMutation.isPending}
                    className="flex-1"
                  >
                    {resetImportMutation.isPending ? 'Procesando...' : '✓ Sí, Resetear e Importar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelConfirmation}
                    disabled={resetImportMutation.isPending}
                    className="flex-1"
                  >
                    ✗ Cancelar
                  </Button>
                </div>
              </div>
            </Alert>
          )}

          {/* Import Result */}
          {result && (
            <div className="space-y-4">
              <Alert variant={result.success ? 'default' : 'destructive'}>
                <div className="space-y-3">
                  <p className="font-semibold text-lg">
                    {result.success ? '✅ Importación Exitosa' : '❌ Error en Importación'}
                  </p>

                  {result.success && (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p className="font-semibold text-blue-800">Ítems:</p>
                          <p>🗑️ Eliminados: {result.stats.items_eliminados}</p>
                          <p>✅ Creados: {result.stats.items_creados}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-green-800">Catálogos Creados:</p>
                          <p>🏢 Sedes: {result.stats.sedes_creadas}</p>
                          <p>📍 Ubicaciones: {result.stats.ubicaciones_creadas}</p>
                          <p>📦 Artículos: {result.stats.articulos_creados}</p>
                          <p>👤 Responsables: {result.stats.responsables_creados}</p>
                        </div>
                      </div>

                      {result.errors.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                          <p className="font-semibold text-yellow-900 mb-2">⚠️ Advertencias:</p>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            {result.errors.slice(0, 10).map((error, idx) => (
                              <li key={idx} className="list-disc list-inside">
                                {error}
                              </li>
                            ))}
                            {result.errors.length > 10 && (
                              <li className="text-xs italic">
                                ... y {result.errors.length - 10} advertencias más
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {!result.success && result.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-semibold text-red-800">Errores encontrados:</p>
                      <ul className="text-sm text-red-700 space-y-1 max-h-60 overflow-y-auto">
                        {result.errors.map((error, idx) => (
                          <li key={idx} className="list-disc list-inside">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter>
          {!showConfirmation && !result && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={resetImportMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleRequestImport}
                disabled={!selectedFile || resetImportMutation.isPending}
              >
                Continuar
              </Button>
            </>
          )}

          {result && (
            <Button type="button" onClick={handleClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

