'use client';

import { useState } from 'react';
import { 
  ItemsTable, 
  ItemFormDialog, 
  ImportDialog, 
  BatchEditDialog,
  BulkCreateDialog 
} from '@/components/items';
import { DashboardNav } from '@/components/dashboard';

export default function Home() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
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
      <BatchEditDialog 
        open={batchEditDialogOpen} 
        onClose={handleBatchEditDialogClose} 
        selectedIds={selectedItemIds} 
      />
      <BulkCreateDialog 
        open={bulkCreateDialogOpen} 
        onClose={handleBulkCreateDialogClose} 
      />
    </>
  );
}
