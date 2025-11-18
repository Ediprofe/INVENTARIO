'use client';

import { useState } from 'react';
import { ItemsTable, ItemFormDialog, ImportDialog } from '@/components/items';

export default function Home() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

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

  const handleFormDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
  };

  return (
    <>
      <ItemsTable
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onImportClick={handleImportClick}
      />
      <ItemFormDialog open={formDialogOpen} onClose={handleFormDialogClose} itemId={selectedItemId} />
      <ImportDialog open={importDialogOpen} onClose={handleImportDialogClose} />
    </>
  );
}
