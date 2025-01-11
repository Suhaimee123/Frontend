import React, { useState, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { fetchVolunteerHours, fetchSpecialWorkHours } from '@/app/api/CheckHour';
import { fetchRankinActivity, RankinResponse } from '@/app/api/Rankin';
import DataTable from '@/components/Table';
import { GridColDef } from '@mui/x-data-grid';
import { VolunteerHoursResponse, SpecialWorkResponse } from '@/types/IResponse';
import { log } from 'console';
import { Grid } from '@mui/material';

const CheckHoursWork: React.FC = () => {
  const [studentId, setStudentId] = useState<string>('');
  const [volunteerData, setVolunteerData] = useState<VolunteerHoursResponse[]>([]);
  const [specialWorkData, setSpecialWorkData] = useState<SpecialWorkResponse[]>([]);
  const [rankinData, setRankinData] = useState<RankinResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const totalVolunteerHours = useMemo(() => {
    return volunteerData.reduce((accumulator, item) => {
      return item.hours ? accumulator + Number(item.hours) : accumulator;
    }, 0);
  }, [volunteerData]);

  const totalSpecialWorkHours = useMemo(() => {
    return specialWorkData.reduce((accumulator, item) => {
      return item.hours ? accumulator + Number(item.hours) : accumulator;
    }, 0);
  }, [specialWorkData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!studentId) {
      setError('กรุณากรอกรหัสนักศึกษาก่อน');
      return;
    }
  
    setLoading(true);
    setError(null); // ลบข้อผิดพลาดที่เคยเกิดขึ้นก่อนหน้านี้
  
    try {
      // Fetch volunteer hours
      let volunteerResponse: VolunteerHoursResponse[] = [];
      try {
        volunteerResponse = await fetchVolunteerHours(studentId);
        setVolunteerData(volunteerResponse);
      } catch (error) {
        console.error('Error fetching volunteer hours:', error);
        setVolunteerData([]); // Set to empty array if error occurs
      }
  
      // Fetch special work hours
      let specialWorkResponse: SpecialWorkResponse[] = [];
      try {
        specialWorkResponse = await fetchSpecialWorkHours(studentId);
        setSpecialWorkData(specialWorkResponse);
      } catch (error) {
        console.error('Error fetching special work hours:', error);
        setSpecialWorkData([]); // Set to empty array if error occurs
      }
  
      // If both volunteer and special work data are empty, show an error
      if (volunteerResponse.length === 0 && specialWorkResponse.length === 0) {
        setError('ไม่พบข้อมูลสำหรับรหัสนักศึกษานี้');
      } else {
        setError(null); // Clear any previous errors if data is found
      }
  
      // Determine which student ID to use for rankin lookup
      const rankinStudentId = volunteerResponse.length > 0
        ? volunteerResponse[0].studentId
        : specialWorkResponse.length > 0
          ? specialWorkResponse[0].studentId
          : null;
  
      if (rankinStudentId) {
        try {
          const rankinResponse = await fetchRankinActivity(rankinStudentId);
          setRankinData(rankinResponse);
          console.log(rankinResponse);
        } catch (error) {
          console.error('Error fetching rankin activity:', error);
          setRankinData(null); // Set to null if error occurs
        }
      } else {
        console.warn('No student ID available for rankin lookup.');
        setRankinData(null);
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };
  




  const filteredVolunteerRows = volunteerData
    .filter((item) => item.studentId === studentId)
    .map((item, index) => ({
      id: index,
      studentId: item.studentId,
      firstName: item.firstName,
      activityName: item.activityName,
      organizationName: item.organizationName,
      organizationPhone: item.organizationPhone,
      activityDescription: item.activityDescription,
      activityDate: new Date(item.activityDate).toLocaleDateString(),
      hours: item.hours,
    }));

  const filteredSpecialWorkRows = specialWorkData
    .filter((item) => item.studentId === studentId)
    .map((item, index) => ({
      id: index + volunteerData.length,
      studentId: item.studentId,
      firstName: item.firstName,
      workName: item.workName,
      organizationName: item.organizationName,
      organizationPhone: item.organizationPhone,
      workDescription: item.workDescription,
      workDate: new Date(item.workDate).toLocaleDateString(),
      hours: item.hours,
    }));

  const volunteerColumns: GridColDef[] = [
    { field: 'studentId', headerName: 'รหัสนักศึกษา', width: 175 },
    { field: 'firstName', headerName: 'ชื่อ-นามสกุล', width: 150 },
    { field: 'activityName', headerName: 'ชื่อกิจกรรมจิตอาสา', width: 200 },
    { field: 'organizationName', headerName: 'ชื่อองค์กร', width: 180 },
    { field: 'organizationPhone', headerName: 'เบอร์โทรองค์กร', width: 150 },
    { field: 'activityDescription', headerName: 'รายละเอียดกิจกรรม', width: 250 },
    { field: 'activityDate', headerName: 'วันที่จัดกิจกรรม', width: 150 },
    { field: 'hours', headerName: 'จำนวนชั่วโมง', width: 100 },
  ];

  const specialWorkColumns: GridColDef[] = [
    { field: 'workName', headerName: 'ชื่อกิจกรรมพิเศษ', width: 200 },
    { field: 'organizationName', headerName: 'ชื่อองค์กร', width: 180 },
    { field: 'organizationPhone', headerName: 'เบอร์โทรองค์กร', width: 150 },
    { field: 'workDescription', headerName: 'รายละเอียดกิจกรรมพิเศษ', width: 250 },
    { field: 'workDate', headerName: 'วันที่จัดกิจกรรม', width: 150 },
    { field: 'hours', headerName: 'จำนวนชั่วโมง', width: 100 },
  ];
  console.log(rankinData, 'eeee33');
  console.log(volunteerData, 'eeeeeee4');


  return (
    <main>
      <Typography variant="h5" gutterBottom>
        ตรวจสอบชั่วโมงจิตอาสาและชั่วโมงงานพิเศษ
      </Typography>

      <Box component="form" sx={{ flexGrow: 1 }} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="รหัสนักศึกษา"
          name="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'ตรวจสอบ'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
      {volunteerData.length > 0 && (
  <Typography 
    variant="h6"
    sx={{
      color: totalVolunteerHours >= 32 ? 'green' : 'red', // ใช้สีเขียวถ้าเกินหรือเท่ากับ 32, ถ้าน้อยกว่าก็เป็นสีแดง
    }}
  >
    จำนวนชั่วโมงจิตอาสาของคุณ: {totalVolunteerHours} / 32
  </Typography>
)}

        {volunteerData.length > 0 && totalVolunteerHours < 32 && (
          <Typography variant="h6">
            คุณมีจำนวนชั่วโมงจิตอาสา{totalVolunteerHours} ชั่วโมง    เหลือจำนวนชั่วโมงจิตอาสาอีก  {32 - totalVolunteerHours} ชั่วโมง เพื่อให้จำนวนชั่วโมงจิตอาสาครบ 32 ชั่วโมง
          </Typography>
        )}
        {volunteerData.length > 0 && totalVolunteerHours >= 32 && (
          <Typography variant="h6">
            คุณมีจำนวนชั่วโมงจิตอาสา {totalVolunteerHours} ชั่วโมง  จำนวนชั่วโมงจิตอาสาของคุณครบ 32 ชั่วโมงแล้ว!
          </Typography>
        )}
        {specialWorkData.length > 0 && (
          <Typography variant="h6">จำนวนชั่วโมงงานพิเศษของคุณ:  {totalSpecialWorkHours}  ชั่วโมง</Typography>
        )}

        {rankinData && rankinData.length > 0 && (
          rankinData.map((data, index) => (
            data.studentId === volunteerData[0]?.studentId && (
              <Typography key={index} variant="h6">
                อันดับชั่วโมงจิตอาสาของคุณอยู่อันดับที่ : {data.rank} 
              </Typography>
            )
          ))
        )}
      </Box>
        
     <Grid container spacing={1} sx={{ overflowX: 'auto' }}>
  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
    {/* Render Volunteer Data */}
    {volunteerData.length > 0 && specialWorkData.length === 0 && (
      <Grid item xs={12} sm={6} md={5} sx={{ overflowX: 'auto' }}> {/* Adjust width */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">ชั่วโมงจิตอาสา</Typography>
          <DataTable rows={filteredVolunteerRows} initialColumns={volunteerColumns} />
        </Box>
      </Grid>
    )}

    {/* Render Special Work Data */}
    {specialWorkData.length > 0 && volunteerData.length === 0 && (
      <Grid item xs={12} sm={6} md={5} sx={{ overflowX: 'auto' }}> {/* Adjust width */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">ชั่วโมงจิตงานพิเศษ</Typography>
          <DataTable rows={filteredSpecialWorkRows} initialColumns={specialWorkColumns} />
        </Box>
      </Grid>
    )}

    {/* Render both tables if both datasets are available */}
    {volunteerData.length > 0 && specialWorkData.length > 0 && (
      <>
        <Grid item xs={12} sm={6} md={5} sx={{ overflowX: 'auto' }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6">ชั่วโมงจิตอาสา</Typography>
            <DataTable rows={filteredVolunteerRows} initialColumns={volunteerColumns} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={5} sx={{ overflowX: 'auto' }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6">ชั่วโมงจิตงานพิเศษ</Typography>
            <DataTable rows={filteredSpecialWorkRows} initialColumns={specialWorkColumns} />
          </Box>
        </Grid>
      </>
    )}
  </Box>
</Grid>



      {error && <Alert severity="error">{error}</Alert>}
    </main>
  );
};

export default CheckHoursWork;
