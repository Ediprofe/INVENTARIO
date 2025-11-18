'use client';

import { useState } from 'react';
import { ItemsTable, ItemFormDialog, ImportDialog, BatchEditDialog } from '@/components/items';

export default function Home() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
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

  const handleBatchEditClick = (selectedIds: number[]) => {
    setSelectedItemIds(selectedIds);
    setBatchEditDialogOpen(true);
  };

  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
  };

  const handleBatchEditDialogClose = () => {
    setBatchEditDialogOpen(false);
    setSelectedItemIds([]);
  };

  return (
    <>
      <ItemsTable
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onImportClick={handleImportClick}
        onBatchEditClick={handleBatchEditClick}
      />
      <ItemFormDialog open={formDialogOpen} onClose={handleFormDialogClose} itemId={selectedItemId} />
      <ImportDialog open={importDialogOpen} onClose={handleImportDialogClose} />
      <BatchEditDialog open={batchEditDialogOpen} onClose={handleBatchEditDialogClose} selectedIds={selectedItemIds} />
    </>
  );
}
