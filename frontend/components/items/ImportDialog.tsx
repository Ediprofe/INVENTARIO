'use client';

import { useState, useRef } from 'react';
import { useImportItems } from '@/lib/hooks';
import type { ImportResult } from '@/lib/api';
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

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportDialog({ open, onClose }: ImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportItems();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const result = await importMutation.mutateAsync(selectedFile);
      setImportResult(result);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing:', error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Ítems desde Excel</DialogTitle>
          <DialogDescription>
            Selecciona un archivo Excel (.xlsx) con los ítems a importar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File input */}
          <div className="space-y-2">
            <Label htmlFor="file">Archivo Excel</Label>
            <Input
              id="file"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={importMutation.isPending}
            />
            <p className="text-sm text-gray-500">
              Formatos aceptados: .xlsx, .xls
            </p>
          </div>

          {/* Import result */}
          {importResult && (
            <div className="space-y-4">
              <Alert variant={importResult.errors > 0 ? 'destructive' : 'default'}>
                <div className="space-y-2">
                  <p className="font-semibold">{importResult.message}</p>
                  <div className="text-sm">
                    <p>✅ Creados: {importResult.created}</p>
                    {importResult.errors > 0 && <p>❌ Errores: {importResult.errors}</p>}
                  </div>
                </div>
              </Alert>

              {/* Created items */}
              {importResult.created_items && importResult.created_items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Ítems creados:</h4>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    <ul className="text-sm space-y-1">
                      {importResult.created_items.map((item) => (
                        <li key={item.id} className="text-green-700">
                          Fila {item.row}: {item.codigo} (ID: {item.id})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Errors */}
              {importResult.error_details && importResult.error_details.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Errores encontrados:</h4>
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-red-50">
                    <ul className="text-sm space-y-2">
                      {importResult.error_details.map((error, index) => (
                        <li key={index} className="text-red-700">
                          <span className="font-semibold">Fila {error.row}:</span>{' '}
                          {typeof error.error === 'string'
                            ? error.error
                            : JSON.stringify(error.error)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {importMutation.isError && (
            <Alert variant="destructive">
              <p>Error al importar archivo. Por favor, verifica el formato y vuelve a intentar.</p>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importando...' : 'Importar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
