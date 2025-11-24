'use client';

import { useState } from 'react';
import { 
  ItemsTable, 
  ItemFormDialog, 
  ImportDialog,
  ResetImportDialog,
  BatchEditDialog,
  BulkCreateDialog,
  FloatingBatchEditButton
} from '@/components/items';
import { DashboardNav } from '@/components/dashboard';

export default function Home() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [resetImportDialogOpen, setResetImportDialogOpen] = useState(false);
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
  const [bulkCreateDialogOpen, setBulkCreateDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const handleCreateClick = () => {
    setSelectedItemId(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setFormDialogOpen(true);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleResetImportClick = () => {
    setResetImportDialogOpen(true);
  };

  const handleBatchEditClick = (selectedIds: number[]) => {
    setSelectedItemIds(selectedIds);
    setBatchEditDialogOpen(true);
  };

  const handleBulkCreateClick = () => {
    setBulkCreateDialogOpen(true);
  };

  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
  };

  const handleResetImportDialogClose = () => {
    setResetImportDialogOpen(false);
  };

  const handleBatchEditDialogClose = () => {
    setBatchEditDialogOpen(false);
    setSelectedItemIds([]);
  };

  const handleBulkCreateDialogClose = () => {
    setBulkCreateDialogOpen(false);
  };

  return (
    <>
      <DashboardNav />
      
      <ItemsTable
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onImportClick={handleImportClick}
        onResetImportClick={handleResetImportClick}
        onBatchEditClick={handleBatchEditClick}
        onBulkCreateClick={handleBulkCreateClick}
      />
      
      {/* Diálogos */}
      <ItemFormDialog 
        open={formDialogOpen} 
        onClose={handleFormDialogClose} 
        itemId={selectedItemId} 
      />
      <ImportDialog 
        open={importDialogOpen} 
        onClose={handleImportDialogClose} 
      />
      <ResetImportDialog 
        open={resetImportDialogOpen} 
        onClose={handleResetImportDialogClose} 
      />
      <BatchEditDialog 
        open={batchEditDialogOpen} 
        onClose={handleBatchEditDialogClose} 
        selectedIds={selectedItemIds} 
      />
      <BulkCreateDialog 
        open={bulkCreateDialogOpen} 
        onClose={handleBulkCreateDialogClose} 
      />

      {/* Botón flotante de edición rápida */}
      <FloatingBatchEditButton
        selectedCount={selectedItemIds.length}
        onClick={() => setBatchEditDialogOpen(true)}
      />
    </>
  );
}
