import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarContainer } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CustomColumnDialog from '@/components/CustomColumnDialog';
import * as XLSX from 'xlsx';
import Icondownload from "/public/download.png";
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridOverlay } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';


interface PaginationModel {
  page: number;
  pageSize: number;
}

interface DataTableProps {
  rows: any[];
  rowCount: number;
  initialColumns: GridColDef[];
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
  onRowsSelection?: (selectedIds: any[]) => void;
  selectedRows: any[]; // รับค่า selectedRows จาก props
  props: any[]; // รับค่า students จาก props
  totalCount: number; // รับค่า totalCount จาก props
  onDeleteRows?: (deletedIds: any[]) => void; // Add this line
}

const DataAdminTable: React.FC<DataTableProps> = ({
  rows,
  initialColumns,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  onRowsSelection,
  selectedRows,
  props,
  totalCount,
  onDeleteRows
}) => {
  const [columns, setColumns] = useState<GridColDef[]>(initialColumns);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  const NoRowsOverlay = () => (
    <GridOverlay style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="body1" color="textSecondary">
        ไม่มีข้อมูล
      </Typography>
    </GridOverlay>
  );
  
  
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmColumns = (newColumns: GridColDef[], hiddenColumns: string[]) => {
    setColumns(newColumns.filter(col => !hiddenColumns.includes(col.field)));
    handleCloseDialog();
  };

  const generateHeaders = (data: any[]) => {
    if (data.length === 0) return [];

    return Object.keys(data[0]).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1), // แก้ไขตัวพิมพ์ใหญ่ตามต้องการ
      key: key
    }));
  };

  const downloadExcel = () => {
    // กรองเฉพาะแถวที่เลือกโดยใช้ `id`
    const selectedData = props.filter(student => selectedRows.includes(student.id));

    if (selectedData.length === 0) {
      alert("โปรดเลือกอย่างน้อยหนึ่งแถวที่จะส่งออก");
      return;
    }

    let fileName;
    if (selectedData.length === 1) {
      // Use studentId and firstName if there's only one student
      const firstStudent = selectedData[0];
      fileName = `${firstStudent.studentId}_${firstStudent.firstName}.xlsx`;
    } else {
      // General filename for multiple students
      fileName = `นักเรียนหลายคน.xlsx`;
    }
    const headers = generateHeaders(selectedData);
    const worksheet = XLSX.utils.json_to_sheet(selectedData, { header: headers.map(h => h.key) });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Students');

    // บันทึกไฟล์ด้วยชื่อไฟล์ที่ตั้งค่าไว้
    XLSX.writeFile(workbook, fileName);
  };

  

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
  
    const confirmDelete = window.confirm("คุณแน่ใจว่าต้องการลบรายการที่เลือก?");
    if (!confirmDelete) return;
  
    // Collect selected IDs to send back to Register
    const deletedIds = [...selectedRows];
  
    // Perform local update to reflect the deletion
    const updatedRows = rows.filter(row => !deletedIds.includes(row.id));
  
    // Clear the selected rows state
    onRowsSelection?.([]); // Clear selected rows
  
    // Send deleted IDs to the parent component via onDeleteRows
    if (onDeleteRows) {
      onDeleteRows(deletedIds);
    }
  };
  
  
  

  const toggleShowAllRows = () => {
    setShowAllRows((prevShowAll) => !prevShowAll);
    onPaginationModelChange({
      ...paginationModel,
      pageSize: !showAllRows ? totalCount : 5, // ถ้า showAllRows เป็น true ให้แสดงทั้งหมด มิฉะนั้นแสดงทีละ 5
    });
  };

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

      <Button
        onClick={downloadExcel} // เรียกใช้ฟังก์ชัน downloadExcel
        variant="contained"
        sx={{
          marginLeft: 1,
          backgroundColor: "#217346",
          color: "#ffffff",
          marginBottom: 2,
          display: "flex", // Ensures the icon and text are displayed inline
          alignItems: "center", // Vertically centers the content
          '&:hover': {
            backgroundColor: "#1e5b30",
          },
        }}
      >

        <Image src={Icondownload} alt="PDF Icon" width={24} height={24} style={{ filter: 'invert(1)' }}/>

        Excel
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={toggleShowAllRows} // เรียกใช้ฟังก์ชัน toggleShowAllRows
        sx={{ marginLeft: 1, marginBottom: 2, }}
      >
        {showAllRows ? "ค่าเริ่มต้น" : "แสดงทั้งหมด"}
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteSelected}
        startIcon={<DeleteIcon />}
        disabled={selectedRows.length === 0} // Disable if no rows are selected
        sx={{ marginLeft: 1, marginBottom: 2 }}
      >
        ลบ
      </Button>
    </GridToolbarContainer>
  );

  return (
    <Paper sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        rowCount={rowCount}
        pageSizeOptions={[5, 10]}
        onPaginationModelChange={onPaginationModelChange}
        checkboxSelection
        pagination
        paginationMode="server"
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: NoRowsOverlay, // Add custom overlay here
        }}
        sx={{
          maxWidth: '100%', // ให้พื้นที่แสดงผลเต็มที่
          minHeight: '300px', // กำหนดความสูงต่ำสุดของตาราง
        }}
          onRowSelectionModelChange={(newSelection) => {
          onRowsSelection?.([...newSelection]); // ส่งค่า selected row กลับไปที่ `Register`
        }}
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

export default DataAdminTable;
