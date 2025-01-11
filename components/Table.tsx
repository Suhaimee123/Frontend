import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbarContainer, GridPaginationModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CustomColumnDialog from '@/components/CustomColumnDialog';

interface DataTableProps {
  rows: any[]; // Define a more specific type if possible
  initialColumns: GridColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ rows, initialColumns }) => {
  const [columns, setColumns] = useState<GridColDef[]>(initialColumns);
  const [openDialog, setOpenDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 }); // Default pagination model

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmColumns = (newColumns: GridColDef[], hiddenColumns: string[]) => {
    setColumns(newColumns.filter(col => !hiddenColumns.includes(col.field))); // Update columns based on visibility
    handleCloseDialog();
  };

  // Custom toolbar component
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <Button
        onClick={handleOpenDialog}
        variant="outlined"
        startIcon={<AppRegistrationIcon />}
        sx={{ marginBottom: 2 }}
      >
        ปรับแต่งคอลัมน์
      </Button>
    </GridToolbarContainer>
  );

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel} // Use paginationModel
        onPaginationModelChange={(newModel: GridPaginationModel) => setPaginationModel(newModel)} // Handle pagination changes
        pageSizeOptions={[5, 10]} // Correct prop name here
        pagination
        slots={{ toolbar: CustomToolbar }}
        sx={{ border: 0 }}
      />
      <CustomColumnDialog
        open={openDialog}
        columns={initialColumns}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmColumns}
      />
    </Paper>
  );
};

export default DataTable;