"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import axiosApi from '@/utils/Api'; // Make sure axiosApi is configured
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface VolunteerActivity {
  id: number;
  studentId: string;
  firstName: string;
  activityName: string;
  organizationName: string;
  organizationPhone: string;
  activityDescription: string;
  activityDate: string;
  hours: number;
  createDate: string;
}

const CheckVolunteerHoursForm: React.FC = () => {
  const [studentId, setStudentId] = useState<string>('');
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTotalHours(null);
  
    try {
      // Fetch data from the API
      const response = await axiosApi.get<VolunteerActivity[]>(`/volunteer-activities/student/${studentId}`);
      
      // Calculate total hours
      const total = response.data.reduce((sum, activity) => sum + activity.hours, 0);
      setTotalHours(total);
    } catch (error) {
      setError('ไม่พบข้อมูลนักศึกษาหรือเกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout contentTitle="ตรวจสอบชั่วโมงจิตอาสา" >
      
      <main>
        <Typography variant="h5" gutterBottom>
          ตรวจสอบชั่วโมงจิตอาสา
        </Typography>
        <Box component="form" sx={{ flexGrow: 1 }} noValidate autoComplete="off" onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          {totalHours !== null && <Alert severity="success">ชั่วโมงจิตอาสาทั้งหมด: {totalHours}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="รหัสนักศึกษา"
                name="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'ตรวจสอบ'}
            </Button>
          </Box>
        </Box>
      </main>
    </Layout>
  );
};

export default CheckVolunteerHoursForm;
