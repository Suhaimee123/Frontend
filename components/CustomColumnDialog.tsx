import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { GridColDef } from '@mui/x-data-grid';

interface CustomColumnDialogProps {
  open: boolean;
  columns: GridColDef[];
  onClose: () => void;
  onConfirm: (newColumns: GridColDef[], hiddenColumns: string[]) => void;
}

const CustomColumnDialog: React.FC<CustomColumnDialogProps> = ({ open, columns, onClose, onConfirm }) => {
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(columns.map(col => col.field));

  // Update the column visibility
  const handleToggleColumn = (field: string) => {
    setVisibleColumns((prev) => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleConfirm = () => {
    // Filter columns based on visibility
    const newColumns = columns.filter(col => visibleColumns.includes(col.field));
    onConfirm(newColumns, columns.map(col => col.field).filter(field => !visibleColumns.includes(field)));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ปรับแต่งคอลัมน์</DialogTitle>
      <DialogContent>
        {columns.map((col) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={visibleColumns.includes(col.field)} // Check if the column is visible
                onChange={() => handleToggleColumn(col.field)} // Handle toggle
              />
            }
            label={col.headerName}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button onClick={handleConfirm}>ยืนยัน</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomColumnDialog;
