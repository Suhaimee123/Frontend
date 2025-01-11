// VolunteerForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axiosApi from '@/utils/Api'; // Make sure axiosApi is configured
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { log } from 'console';

const VolunteerForm: React.FC = () => {
  const [formValues, setFormValues] = useState({
    studentId: '',
    firstName: '',
    activityName: '',
    organizationName: '',
    organizationPhone: '',
    activityDescription: '',
    activityDate: '',
    hours: '',
    createDate: new Date().toISOString().slice(0, 10), // Default to current date
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [studentIdError, setStudentIdError] = useState<boolean>(false); // State to handle error for studentId

  // Load form data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('volunteerForm');
    if (savedFormData) {
      setFormValues(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage every time formValues changes
  useEffect(() => {
    localStorage.setItem('volunteerForm', JSON.stringify(formValues));
  }, [formValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check if the field is studentId and validate it for numbers
    if (name === 'studentId') {
      if (/^\d*$/.test(value)) { // Allow only numbers
        setStudentIdError(false);
        setFormValues({ ...formValues, [name]: value });
      } else {
        setStudentIdError(true);
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log(formValues);
    
    
    try {
      const response = await axiosApi.post('/volunteer-activities', formValues); // Replace with actual API route
      setSuccess('Volunteer hours submitted successfully!');
      
      // Clear form and remove from localStorage
      localStorage.removeItem('volunteerForm');
      setFormValues({
        studentId: '',
        firstName: '',
        activityName: '',
        organizationName: '',
        organizationPhone: '',
        activityDescription: '',
        activityDate: '',
        hours: '',
        createDate: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout contentTitle="Work" >
      <main>
        <Typography variant="h5" gutterBottom>
          Work
        </Typography>
        <Box component="form" sx={{ flexGrow: 1 }} noValidate autoComplete="off" onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="รหัสนักศึกษา"
                name="studentId"
                value={formValues.studentId}
                onChange={handleChange}
                error={studentIdError} // Set error state for studentId field
                helperText={studentIdError ? 'Please enter only numbers' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ชื่อ-นามสกุล"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ชื่อกอจจกรรมที่ทำ"
                name="activityName"
                value={formValues.activityName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ชื่อองค์กร"
                name="organizationName"
                value={formValues.organizationName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="เบอร์โทร องค์กร"
                name="organizationPhone"
                value={formValues.organizationPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="รายละเอียดจิตอาสา"
                name="activityDescription"
                value={formValues.activityDescription}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="วันที่-จัดทำกิจกรม"
                name="activityDate"
                value={formValues.activityDate}
                onChange={handleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="จำนวนชั่วโมง"
                name="hours"
                value={formValues.hours}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="วันที่บันทึก"
                name="createDate"
                value={formValues.createDate}
                onChange={handleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </main>
    </Layout>
  );
};

export default VolunteerForm;
