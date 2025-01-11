"use client";

import React, { useEffect, useState } from 'react';
import { FormName, useSidebarNavigation } from '../../components/sidebarItems';
import LayoutAdmin from '../../components/LayoutAdmin';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Grid, Box, Button, IconButton, InputBase, Paper } from '@mui/material';
import CustomizedSwitches from '../../components/Switch'; // นำเข้า CustomizedSwitches
import DataAdminTable from '../../components/DataAdminTable';
import { DeleteScholarship, getLatestScholarship } from '@/app/api/Admin/scholarshipApi';
import { useScholarship } from '@/hooks/Admin/useScholarship';
import AlertBox from '@/components/Alert/Alert';
import { useScholarshipImg } from '@/hooks/Admin/useScholarshipImg';
import SearchIcon from '@mui/icons-material/Search';
import IconDownloadPDF from "/public/pdffile.png";

import Image from 'next/image';
import { GridRenderCellParams } from '@mui/x-data-grid';

interface PaginationModel {
  page: number;
  pageSize: number;
}

const formatDate = (dateString: string): string => {
  const date = dayjs(dateString).locale('th'); // ตั้งค่าภาษาไทย
  return `${date.date()} ${date.format('MMMM')} ${date.year()} เวลา ${date.format('HH:mm')}`;
};

const Page: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormName>('scholarship');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [switchState, setSwitchState] = useState<boolean>(false); // สถานะสวิตช์ (เปิด/ปิด)
  const [startScholarship, setStartScholarship] = useState<Dayjs | null>(null); // วันที่เริ่มต้น
  const [endScholarship, setEndScholarship] = useState<Dayjs | null>(null); // วันที่สิ้นสุด
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({ page: 0, pageSize: 5 });

  const { scholarship, loading: loadingStudents, error: studentError, totalCount, fetchScholarship } = useScholarshipImg(setPaginationModel);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // สถานะเก็บแถวที่เลือก
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const { handleSidebarClick, renderSidebarItems } = useSidebarNavigation(setSelectedForm, setExpandedItems);
  const { loading, error, closeScholarshipHandler, openScholarshipHandler } = useScholarship();
  const [scholarshipId, setScholarshipId] = useState<number | null>(null);
  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
  };
  const [studentIdSearch, setStudentIdSearch] = useState<string>(''); // State for search input


  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSearchClick(); // Call your search function here
    }
  };

  const handleSearchClick = () => {
    fetchScholarship(paginationModel.page, paginationModel.pageSize, studentIdSearch);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentIdSearch(event.target.value);
  };

  useEffect(() => {
    fetchScholarship(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);


  const initialColumns = [
    { field: 'studentId', headerName: 'รหัสนักเรียน', width: 250 },
    { field: 'imageData', headerName: 'ไฟล์', width: 250 ,
      renderCell: (params: { row: any }) => (
      <IconButton onClick={() => handleDownloadPdf(params.row)}>
        <Image src={IconDownloadPDF} alt="PDF Icon" width={24} height={24} />
      </IconButton>
    ),},
    { field: 'firstName', headerName: 'ชื่อ', width: 200 },
    { field: 'totalVolunteerHours', headerName: 'ชั่วโมงจิตอาสา', width: 150,
      renderCell: (params: GridRenderCellParams<any>) => { // Type specified here
        const hours = params.value;
        const color = hours < 32 ? 'red' : 'green';
        return (
          <span style={{ color }}>{hours} ชั่วโมง</span>
        );
      }
    },
    { field: 'imageName', headerName: 'ชื่อไฟล์', width: 250 },
    { field: 'createDate', headerName: 'วันที่สง', width: 250, renderCell: (params: any) => formatDate(params.value),  },
  ];



  
  const handleDownloadPdf = (row: any) => {
    const fileId = row.imageData; // ใช้ imageData ที่เป็น fileId ของ Google Drive

    // สร้าง URL สำหรับดาวน์โหลดจาก Google Drive
    const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
    console.log(`Downloading file from Google Drive: ${googleDriveUrl}`);
    
    // สร้างลิงก์สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.href = googleDriveUrl;
    link.click();
  
    // เพิ่ม log เพื่อให้เห็นว่าไฟล์กำลังดาวน์โหลด
};



  const handleRowsSelection = (selectedIds: any[]) => {
    setSelectedRows(selectedIds); // อัปเดตสถานะเมื่อแถวถูกเลือก
    console.log("Selected Rows: ", selectedIds); // แสดงค่าที่เลือกเพื่อตรวจสอบ
  };


  const handleDeletedIds = async (deletedIds: any[]) => {
    try {
      console.log("Deleted IDs:", deletedIds);

      // ฟังก์ชันลบทีละ ID
      for (const id of deletedIds) {
        const response = await DeleteScholarship(id);
        console.log(`Deletion result for ID ${id}:`, response);
        
        // ถ้าลบสำเร็จ, แสดง alert success
        if (response.success) {
          setAlertText('Success');
          setAlertDesc(`Scholarship with ID ${id} deleted successfully.`);
          setAlertType('success');
        } else {
          setAlertText('Error');
          setAlertDesc(`Failed to delete scholarship with ID ${id}.`);
          setAlertType('error');
        }

        // เปิด alert box
        setIsAlertOpen(true);
      }

      // เรียกฟังก์ชัน fetchScholarship เพื่ออัปเดตข้อมูลหลังจากลบเสร็จ
      fetchScholarship(paginationModel.page, paginationModel.pageSize);

    } catch (error) {
      console.error("Error handling deleted IDs:", error);
      
      // ถ้ามีข้อผิดพลาด, แสดง alert error
      setAlertText('Error');
      setAlertDesc('An error occurred while deleting scholarships.');
      setAlertType('error');
      setIsAlertOpen(true);
    }
  };
  
  



  useEffect(() => {
    const fetchLatestScholarship = async () => {
      try {
        const response = await getLatestScholarship();
        if (response.success && response.data) {
          const currentDate = dayjs(); // Get current date and time
          const scholarshipEndDate = dayjs(response.data.endDate);

          if (scholarshipEndDate.isBefore(currentDate)) {
            setSwitchState(false); // Turn off the switch
          } else {
            setSwitchState(response.data.status === 'open');
          }

          setStartScholarship(dayjs(response.data.startDate)); // Set start date
          setEndScholarship(dayjs(response.data.endDate)); // Set end date
          setScholarshipId(response.data.id); // Set scholarship ID
        } else {
          console.error('Error retrieving latest scholarship:', response.message);
        }
      } catch (error) {
        console.error('Error fetching latest scholarship:', error);
      }
    };

    fetchLatestScholarship();
  }, []);


  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่ม
  const handleSubmit = async () => {
    if (!scholarshipId) {
      setAlertText('ข้อผิดพลาด');
      setAlertDesc('ไม่พบข้อมูลทุนการศึกษา');
      setAlertType('error');
      setIsAlertOpen(true);
      return;
    }

    if (switchState) {
      // Open Scholarship
      if (!startScholarship || !endScholarship) {
        setAlertText('ข้อผิดพลาด');
        setAlertDesc('กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด');
        setAlertType('error');
        setIsAlertOpen(true);
        return;
      }

      const startDate = startScholarship?.startOf('day').format('YYYY-MM-DDTHH:mm:ss'); // เวลาเริ่มต้นของวัน
      const endDate = endScholarship?.endOf('day').format('YYYY-MM-DDTHH:mm:ss'); // เวลาสิ้นสุดของวัน
      

      try {
        const response = await openScholarshipHandler(scholarshipId, startDate, endDate);
        if (response.success) {
          setAlertText('สำเร็จ');
          setAlertDesc('เปิดทุนการศึกษาสำเร็จ');
          setAlertType('success');
        } else {
          setAlertText('ข้อผิดพลาด');
          setAlertDesc('ไม่สามารถเปิดทุนการศึกษาได้');
          setAlertType('error');
        }
      } catch (err) {
        setAlertText('ข้อผิดพลาด');
        setAlertDesc('เกิดข้อผิดพลาด: ไม่สามารถเปิดทุนการศึกษาได้');
        setAlertType('error');
      }
      setIsAlertOpen(true);
    } else {
      try {
        const response = await closeScholarshipHandler(scholarshipId);
        if (response.success) {
          setAlertText('สำเร็จ');
          setAlertDesc('ปิดทุนการศึกษาสำเร็จ');
          setAlertType('success');
        } else {
          setAlertText('ข้อผิดพลาด');
          setAlertDesc('ไม่สามารถปิดทุนการศึกษาได้');
          setAlertType('error');
        }
      } catch (err) {
        setAlertText('ข้อผิดพลาด');
        setAlertDesc('เกิดข้อผิดพลาด: ไม่สามารถปิดทุนการศึกษาได้');
        setAlertType('error');
      }
      setIsAlertOpen(true);
    }
  };




  return (
    <>
      <LayoutAdmin
        contentTitle="ต่อทุนการศึกษา"
        sidebarItems={renderSidebarItems} // ส่ง sidebarItems ที่เราสร้างขึ้น
      >
        <main>
          <Box display="flex" justifyContent="space-between" alignItems="center" >
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}> {/* ใช้ gap เพื่อเพิ่มระยะห่างระหว่างแต่ละองค์ประกอบ */}

                  <CustomizedSwitches
                    checked={switchState}
                    onChange={(checked) => setSwitchState(checked)} // อัปเดตสถานะสวิตช์
                  />


                  <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                      <DatePicker
                        label="วันที่เริ่มต้น"
                        value={startScholarship}
                        onChange={(newValue) => setStartScholarship(newValue)}
                        views={['year', 'month', 'day']} // Enable day selection
                        minDate={dayjs()} // Disable past dates
                        disabled={!switchState} // Disable when switch is OFF
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small', // Adjust size
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                      <DatePicker
                        label="วันที่สิ้นสุด"
                        value={endScholarship}
                        onChange={(newValue) => setEndScholarship(newValue)}
                        views={['year', 'month', 'day']} // Enable day selection
                        minDate={startScholarship || dayjs()} // Disable dates before start date
                        disabled={!switchState} // Disable when switch is OFF
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small', // Adjust size
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      ยืนยัน
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* DataAdminTable */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <DataAdminTable
              rows={scholarship}
              initialColumns={initialColumns}
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              onRowsSelection={handleRowsSelection} // ส่งฟังก์ชันมาในพร็อพ
              selectedRows={selectedRows} // ส่ง selectedRows
              props={scholarship} // ส่ง students
              totalCount={totalCount} // ส่ง totalCount
              onDeleteRows={handleDeletedIds}
            />
          </Box>
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

export default Page;
