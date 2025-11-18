'use client';

import { useState } from 'react';
import { ItemsTable, ItemFormDialog } from '@/components/items';

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleCreateClick = () => {
    setSelectedItemId(null);
    setDialogOpen(true);
  };

  const handleEditClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
      <ItemsTable onCreateClick={handleCreateClick} onEditClick={handleEditClick} />
      <ItemFormDialog open={dialogOpen} onClose={handleDialogClose} itemId={selectedItemId} />
    </>
  );
}
