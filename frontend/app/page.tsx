'use client';

import { useState } from 'react';
import { 
  ItemsTable, 
  ItemFormDialog, 
  ImportDialog, 
  BatchEditDialog, 
  BatchEditSpreadsheetDialog,
  BulkCreateDialog 
} from '@/components/items';

export default function Home() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);
  const [batchEditSpreadsheetDialogOpen, setBatchEditSpreadsheetDialogOpen] = useState(false);
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

  const handleBatchEditSpreadsheetClick = (selectedIds: number[]) => {
    setSelectedItemIds(selectedIds);
    setBatchEditSpreadsheetDialogOpen(true);
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

  const handleBatchEditSpreadsheetDialogClose = () => {
    setBatchEditSpreadsheetDialogOpen(false);
    setSelectedItemIds([]);
  };

  const handleBulkCreateDialogClose = () => {
    setBulkCreateDialogOpen(false);
  };

  return (
    <>
      <ItemsTable
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onImportClick={handleImportClick}
        onBatchEditClick={handleBatchEditClick}
        onBatchEditSpreadsheetClick={handleBatchEditSpreadsheetClick}
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
      <BatchEditSpreadsheetDialog 
        open={batchEditSpreadsheetDialogOpen} 
        onClose={handleBatchEditSpreadsheetDialogClose} 
        selectedIds={selectedItemIds} 
      />
      <BulkCreateDialog 
        open={bulkCreateDialogOpen} 
        onClose={handleBulkCreateDialogClose} 
      />
    </>
  );
}
