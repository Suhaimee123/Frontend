"use client";

import React, { useState, useEffect } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { FormName, useSidebarNavigation } from '../../components/sidebarItems';
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DataAdminTable from '../../components/DataAdminTable';
import { Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Snackbar, IconButton, InputBase, Paper, MenuItem, Select } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { volunteer } from '@/hooks/Admin/volunteer';
import EditIcon from '@mui/icons-material/Edit';
import EditeVolunteer from '@/app/Volunteer/admin/editeVoluteer';
import { FormValues } from '@/types/Volunteer';
import SearchIcon from '@mui/icons-material/Search';

import { utils, writeFile, write } from 'xlsx';
import DataAdminTableRankin from '../../components/DataAdminTableRankin';
import { ApiAllVolunteer } from '@/app/api/Admin/Volunteer';
import AlertBox from '@/components/Alert/Alert';



interface PaginationModel {
  page: number;
  pageSize: number;
}

const Volunteer: React.FC = () => {

  const [rankingData, setRankingData] = useState<FormValues[]>([]);
  const [showRanking, setShowRanking] = useState(false);

  const [selectedForm, setSelectedForm] = useState<FormName>('Volunteer');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { handleSidebarClick, renderSidebarItems } = useSidebarNavigation(setSelectedForm, setExpandedItems);



  const [paginationModel, setPaginationModel] = useState<PaginationModel>({ page: 0, pageSize: 5 });
  const { Volunteer, loading, error, totalCount, fetchvolunteer } = volunteer(setPaginationModel);
  const formValunteer = useForm<FormValues>();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<FormValues | null>(null);
  const [showAllRows, setShowAllRows] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // สถานะเก็บแถวที่เลือก


  const { setValue, getValues } = formValunteer;
  {/* ตรงนี้ */ }
  const [studentIdSearch, setStudentIdSearch] = useState<string>(''); // State for search input
  {/* ถึง */ }
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');


  const initialColumns = [
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: any; }) => (
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    { field: 'studentId', headerName: 'รหัสรักศึกษา', width: 150 },
    { field: 'prefix', headerName: 'คำนำหน้า', width: 150 },
    { field: 'firstName', headerName: 'ชื่อ - นามสกุล', width: 200 },
    { field: 'nickname', headerName: 'ชื่อเล่น', width: 200 },
    { field: 'branch', headerName: 'สาขา', width: 200 },
    { field: 'graduate', headerName: 'ชั้นปี', width: 200 },
    { field: 'activityName', headerName: 'ชื่อกิจกรรมจิตอาสา', width: 200 },
    { field: 'organizationName', headerName: 'ชื่อองค์กร', width: 250 },
    { field: 'organizationPhone', headerName: 'เบอร์โทร', width: 150 },
    { field: 'activityDescription', headerName: 'รายละเอียดจิตอาสา', width: 300 },
    { field: 'activityDate', headerName: 'วันที่ทำกิจกรรม', width: 150 },
    { field: 'hours', headerName: 'จำนวนชั่วโมง', width: 100 },
    { field: 'createDate', headerName: 'วันที่ส่ง จิตอาสา', width: 150 },
  ];

  const handleShowRanking = () => {
    const aggregatedData = Volunteer.reduce<Record<string, { hours: number;[key: string]: any }>>((acc, curr) => {
      const studentId = curr.studentId; // studentId อาจเป็น undefined

      if (studentId) { // ตรวจสอบว่า studentId มีค่าอยู่
        if (!acc[studentId]) {
          acc[studentId] = { hours: 0, ...curr }; // กำหนดข้อมูลเบื้องต้นสำหรับ studentId นี้
        }
        acc[studentId].hours += (curr.hours ?? 0);
      }

      return acc;
    }, {});

    // แปลง Object เป็น Array และจัดอันดับตามจำนวนชั่วโมงรวม
    const rankingArray = Object.values(aggregatedData).sort((a, b) => b.hours - a.hours);
    setRankingData(rankingArray); // เก็บข้อมูลจัดอันดับ
    setShowRanking(true); // เปิดการแสดงการจัดอันดับ
  };



  const handleCreateVolunteer = () => {
    setOpen(true);
    formValunteer.reset();
  };

  const handleClose = () => {
    setOpen(false);
    formValunteer.reset();
  };

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    console.log('Pagination changed:', newModel);
    setPaginationModel(newModel);
  };

  const toggleShowAllRows = () => {
    setShowAllRows((prevShowAll) => !prevShowAll);
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: !showAllRows ? totalCount : 5, // ถ้า showAllRows เป็น true ให้แสดงทั้งหมด มิฉะนั้นแสดงทีละ 5
    }));
  };

  const handleEdit = (rowData: FormValues) => {
    console.log('Edit action for row:', rowData);
    // Set selected student data
    setSelectedVolunteer(rowData);
    // Set form values using a loop
    Object.keys(rowData).forEach((key) => {
      setValue(key as keyof FormValues, rowData[key as keyof FormValues]); // Use key as keyof Student
    });

    setOpen(true); // Open the dialog
  };

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
    fetchvolunteer(paginationModel.page, paginationModel.pageSize, studentIdSearch);
  };





  useEffect(() => {
    console.log('Fetching students:', paginationModel);
    fetchvolunteer(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    console.log('Students data:', Volunteer);
    console.log('Total count:', totalCount);
  }, [Volunteer, totalCount]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);




  const handleDeletedIds = async (deletedIds: number[]): Promise<number[]> => {
    console.log("Deleting IDs:", deletedIds);
  
    const successfulDeletes: number[] = [];
  
    try {
      for (const id of deletedIds) {
        const response = await ApiAllVolunteer.deleteVolunteerActivity(id); // Call API for each ID
  
        if (response.success) {
          console.log(`Successfully deleted ID: ${id}`);
          successfulDeletes.push(id);
  
          setAlertText("Success");
          setAlertDesc(`ลบข้อมูลสำเร็จ`);
          setAlertType("success");
        } else {
          console.error(`Failed to delete ID: ${id} - ${response.error}`);
  
          setAlertText("Error");
          setAlertDesc( `Network Eror`);
          setAlertType("error");
        }
        setIsAlertOpen(true); // Show the alert after every response
      }
  
      fetchvolunteer(paginationModel.page, paginationModel.pageSize);
  
      return successfulDeletes; // Return all successfully deleted IDs
    } catch (error) {
      console.error("Error deleting IDs:", error);
  
      setAlertText("Deletion Error");
      setAlertDesc("");
      setAlertType("error");
      setIsAlertOpen(true);
  
      return successfulDeletes; // Return whatever succeeded before the error
    }
  };
  
  
  

  const handleRowsSelection = (selectedIds: any[]) => {
    setSelectedRows(selectedIds); // อัปเดตสถานะเมื่อแถวถูกเลือก
    console.log("Selected Rows: ", selectedIds); // แสดงค่าที่เลือกเพื่อตรวจสอบ
  };

  return (
    <>
    <LayoutAdmin contentTitle="บันทึกจิตอาสา" sidebarItems={renderSidebarItems}>
      <main>


        {/* แสดงตารางการจัดอันดับ */}
        {showRanking && (
          <Dialog open={showRanking} onClose={() => setShowRanking(false)} maxWidth="lg" fullWidth>
            <DialogTitle>เรียงลำดับจำนวนชั่วโมงจิตอาสา</DialogTitle>

            <DialogContent>
              <DataAdminTableRankin
                rows={rankingData}
                initialColumns={[
                  { field: 'studentId', headerName: 'รหัสรักศึกษา', width: 150 },
                  { field: 'firstName', headerName: 'ชื่อ - นามสกุล', width: 200 },
                  { field: 'hours', 
                    headerName: 'จำนวนชั่วโมงรวม', 
                    width: 150, 
                    renderCell: (params) => {
                      const hours = params.value;
                      const color = hours < 32 ? 'red' : 'green'; // Apply red for less than 32, green for 32 or more
                      return <span style={{ color }}>{hours}</span>;
                    }
                  }
                ]}
                rowCount={rankingData.length}
                onRowsSelection={handleRowsSelection} // ส่งฟังก์ชันมาในพร็อพ
                selectedRows={selectedRows} // ส่ง selectedRows
                props={Volunteer}
                totalCount={totalCount}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange} />
            </DialogContent>
          </Dialog>


        )}






        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box flexGrow={1} display="flex" justifyContent="center">
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="ค้นหา รหัสนักศึกษา"
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
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={handleShowRanking} color="primary" sx={{ mr: 1 }}>
            เรียงลำดับ จำนวนชั่วโมงจิตอาสา
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateVolunteer}>
           สร้าง
          </Button> 
        </Box>



        {loading ? (
          <CircularProgress />
        ) : (
          <DataAdminTable
            rows={Volunteer}
            initialColumns={initialColumns}
            rowCount={totalCount}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            onRowsSelection={handleRowsSelection} // ส่งฟังก์ชันมาในพร็อพ
            selectedRows={selectedRows} // ส่ง selectedRows
            props={Volunteer}
            totalCount={totalCount}
            onDeleteRows={handleDeletedIds}
          />
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogTitle>{selectedVolunteer ? 'แก้ไข' : 'เพิ่มบันทึกจิตอาสา'}</DialogTitle>
          <DialogContent>
            <FormProvider {...formValunteer}>
              <EditeVolunteer formValunteer={formValunteer} />
            </FormProvider>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={error || "An error occurred!"}
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
    timeoutDuration={2000}
  />
  </>


  );
};

export default Volunteer;

