"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Dialog, DialogContent, DialogTitle, CircularProgress, Snackbar, IconButton, TextField, InputAdornment, InputBase, Paper } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { Student } from '@/types/Register';
import EditIcon from '@mui/icons-material/Edit';
import IconPDF from "/public/pdf.png";
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import dynamic from 'next/dynamic';
import { GridColDef } from '@mui/x-data-grid';
import { deleteStudentById } from '@/app/api/Admin/RegisterAdmin';
import AlertBox from '@/components/Alert/Alert';
import { FormName, useSidebarNavigation } from '@/app/pim/components/sidebarItems';
import LayoutAdmin from '@/app/pim/components/LayoutAdmin';
import DataAdminTable from '@/app/pim/components/DataAdminTable';
import { useStudents } from '@/hooks/Admin/useStudentsPassed';


const AdminTabCards = dynamic(() => import('../RegisterComponents/AdminTabCards'), { ssr: false });
const FromCombinedPDF = dynamic(() => import('@/app/pim/components/FromCombinedPDF'), { ssr: false });


interface PaginationModel {
  page: number;
  pageSize: number;
}

const CheckStatusPassed: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormName>('CheckStatusPassed');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { handleSidebarClick, renderSidebarItems } = useSidebarNavigation(setSelectedForm, setExpandedItems);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({ page: 0, pageSize: 5 });
  const { students, loading: loadingStudents, error: studentError, totalCount, fetchStudentsPasseds } = useStudents(setPaginationModel);
  const formMethods = useForm<Student>();
  const { setValue } = formMethods;
  const [openEditDialog, setOpenEditDialog] = useState(false); // For edit/create student
  const [openPdfDialog, setOpenPdfDialog] = useState(false); // For PDF view
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // สถานะเก็บแถวที่เลือก
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');




  {/* ตรงนี้ */ }
  const [studentIdSearch, setStudentIdSearch] = useState<string>(''); // State for search input
  {/* ถึง */ }
  const initialColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      renderCell: (params: { row: any }) => (
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: 'openPdf',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      renderCell: (params: { row: any }) => (
        <IconButton onClick={() => handleOpenPdf(params.row)}>
          <Image src={IconPDF} alt="PDF Icon" width={24} height={24} />
        </IconButton>
      ),
    },
    { field: 'studentId', headerName: 'รหัสนักเรียน', width: 150, headerAlign: 'center', },
    { field: 'thaiName', headerName: 'ชื่อ', width: 150, headerAlign: 'center', filterable: false, sortable: false, disableColumnMenu: true },
    { field: 'lastName', headerName: 'นามสกุล', width: 150, headerAlign: 'center', filterable: false, sortable: false, disableColumnMenu: true },
    {
      field: 'status',
      headerName: 'การสมัคร',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: any }) => {
        const statusValue = Number(params.row.studentIdCount); // แปลงค่า string เป็น number
        return (
          <span style={{ color: statusValue === 1 ? 'green' : '#ebb840' }}>
            {statusValue === 1 ? "ครั้งแรก" : `ครั้งที่ ${statusValue}`}
          </span>
        );
      },
    },
    {
      field: 'faculty',
      headerName: 'คณะ',
      width: 50,
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: any }) => {
        const abbreviation = params.row.faculty.match(/\(([^)]+)\)/);
        return <span>{abbreviation ? abbreviation[1] : params.row.faculty}</span>;
      },
    },
    {
      field: 'fieldOfStudy',
      headerName: 'สาขา',
      width: 250,
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: any }) => {
        const abbreviation = params.row.fieldOfStudy.match(/\(([^)]+)\)/);
        return <span>{abbreviation ? abbreviation[1] : params.row.fieldOfStudy}</span>;
      },
    },
    { field: 'currentlyStudyingYear', headerName: 'ชั้นปีที่', width: 80, headerAlign: 'center', sortable: false, disableColumnMenu: true },
    { field: 'phoneNumber', headerName: 'หมายเลขโทรศัพท์', width: 150, headerAlign: 'center', sortable: false, disableColumnMenu: true },
    { field: 'email', headerName: 'อีเมล', width: 200, headerAlign: 'center', sortable: false, disableColumnMenu: true },
    { field: 'appointmentDate', headerName: 'เวลานัด', width: 200, headerAlign: 'center', sortable: false, disableColumnMenu: true },
  ];




  const handleEdit = (rowData: Student) => {
    console.log('Edit action for row:', rowData);
    setSelectedStudent(rowData);
    Object.keys(rowData).forEach((key) => {
      setValue(key as keyof Student, rowData[key as keyof Student]);
    });
    setOpenEditDialog(true);

  };

  const handleDeletedIds = async (deletedIds: any[]) => {
    try {
      console.log("Deleted IDs:", deletedIds);
  
      // Filter and map to get application IDs based on deletedIds
      const deletedStudentIds = students
        .filter((student) => deletedIds.includes(student.id)) // Filter students matching deletedIds
        .map((student) => student.applicationId) // Extract applicationId for each matched student
        .filter((applicationId) => applicationId !== undefined); // Filter out undefined values
  
      console.log("Deleted Student Application IDs:", deletedStudentIds);

  
      // Perform deletion for each applicationId
      const deletionResults = await Promise.all(
        deletedStudentIds.map(async (applicationId) => {
          if (applicationId !== undefined) {
            // Log the request before making the API call
            console.log(`Requesting deletion for Application ID: ${applicationId}`);
  
            try {
              const response = await deleteStudentById(applicationId); // Assuming this returns a response
              console.log(`Response from deleteStudentById for Application ID ${applicationId}:`, response);
              return response; // Return response for further processing
            } catch (error) {
              console.error(`Error deleting Application ID ${applicationId}:`, error);
              return null; // Return null if deletion fails
            }
          }
        })
      );
  
      // Handle results from the deletion responses
      deletionResults.forEach((response) => {
        if (response) {
          if (response.success === true) {
            setAlertText("Deletion Successful");
            setAlertDesc(`Successfully deleted student(s).`);
            setAlertType("success");
          } else if (response.success === false) {
            // This handles the case when success is false and error is set
            setAlertText("Deletion Failed");
            setAlertDesc(response.error || "No students were deleted.");
            setAlertType("error");
          } else {
            setAlertText("Deletion Failed");
            setAlertDesc("An unexpected error occurred.");
            setAlertType("error");
          }
        }
      });
  
      // Fetch updated data after successful deletion
      fetchStudentsPasseds(paginationModel.page, paginationModel.pageSize);
  
    } catch (error) {
      console.error("Error deleting students:", error);
      setAlertText("Deletion Error");
      setAlertDesc("An error occurred while deleting students.");
      setAlertType("error");
    } finally {
      setIsAlertOpen(true);
    }
  };
  
  



  const handleOpenPdf = (rowData: Student) => {
    console.log('Opening PDF for student:', rowData);

    if (rowData && Object.keys(rowData).length > 0) {
      setSelectedStudent(rowData);
      Object.keys(rowData).forEach((key) => {
        setValue(key as keyof Student, rowData[key as keyof Student]);
      });
    } else {
      console.error('Row data is invalid:', rowData);
    }

    setOpenPdfDialog(true);
  };




  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
    formMethods.reset();

  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    formMethods.reset();
  };

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
  };

  {/* ตรงนี้ */ }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentIdSearch(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSearchClick(); // Call your search function here
    }
  };

  const handleSearchClick = () => {
    fetchStudentsPasseds(paginationModel.page, paginationModel.pageSize, studentIdSearch);
  };



  {/* ถึง */ }

  useEffect(() => {
    fetchStudentsPasseds(paginationModel.page, paginationModel.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize]);




  useEffect(() => {
    if (studentError) {
      setSnackbarOpen(true);
    }
  }, [studentError]);

  const handleRowsSelection = (selectedIds: any[]) => {
    setSelectedRows(selectedIds); // อัปเดตสถานะเมื่อแถวถูกเลือก
    console.log("Selected Rows: ", selectedIds); // แสดงค่าที่เลือกเพื่อตรวจสอบ
  };


  return (
    <>
      <LayoutAdmin contentTitle="ผ่านรอบแรก" sidebarItems={renderSidebarItems}>
        <main>
          {/* ตรงนี้ */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box flexGrow={1} display="flex" justifyContent="center">
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }} // Adjust width as needed
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="ค้นหา รหัสนักศึกษา" // Thai for "Search by Student ID"
                  inputProps={{ 'aria-label': 'Find Student ID' }}
                  value={studentIdSearch}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>

          </Box>
          {/* ถึง */}
          {loadingStudents ? (
            <CircularProgress />
          ) : (
            <DataAdminTable
              rows={students}
              initialColumns={initialColumns}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              onRowsSelection={handleRowsSelection} // ส่งฟังก์ชันมาในพร็อพ
              selectedRows={selectedRows} // ส่ง selectedRows
              props={students} // ส่ง students
              totalCount={totalCount} // ส่ง totalCount
              onDeleteRows={handleDeletedIds}
            />


          )}

          {/* Edit/Create Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="lg" fullWidth>
            <DialogTitle>{'แก้ไขข้อมูลนักศึกษา' }</DialogTitle>
            <DialogContent>
              <FormProvider {...formMethods}>
                <AdminTabCards formMethods={formMethods}  />
              </FormProvider>
            </DialogContent>
          </Dialog>

          {/* PDF View Dialog */}
          <Dialog
            open={openPdfDialog}
            onClose={handleClosePdfDialog}
            maxWidth={false} // Disable default maxWidth settings
            PaperProps={{
              style: {
                width: '210mm', // A4 width
                height: '297mm', // A4 height
                maxWidth: '210mm',
                // maxHeight: '297mm',
                margin: 'auto',  // Center the dialog
                top: 50,         // Provide top space
              },
            }}
          >
            <DialogContent>
              <FormProvider {...formMethods}>
                <FromCombinedPDF formMethods={formMethods} setOpenPdfDialog={setOpenPdfDialog} />
              </FormProvider>
            </DialogContent>
          </Dialog>


          <Snackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            message={studentError || "An error occurred!"}
            autoHideDuration={6000}
          />
        </main>
      </LayoutAdmin>
      <AlertBox
        text={alertText}
        desc={alertDesc}
        type={alertType}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        timeoutDuration={5000}
      />

    </>
  );
};

export default CheckStatusPassed;
