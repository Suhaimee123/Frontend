import React, { useState } from 'react';
import { TextField, Button, Typography, Box, InputAdornment, Grid } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import LockIcon from '@mui/icons-material/Lock';
import { Student } from "@/types/Register";
import { sendRequestDataApi } from '@/app/api/Register';
import AlertBox from '@/components/Alert/Alert';

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const Secondaryword: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');


  const onSubmit = async (data: Student) => {
    try {
      // Send the data to the API and get the response
      const response = await sendRequestDataApi(data);
  
      // Check the response message and set the alert accordingly
      if (response.success === true) {
        setAlertText('สำเร็จ');
        setAlertDesc('ข้อมูลของท่านได้ถูกบันทึกเรียบร้อยแล้ว');
        setAlertType('success');
      } else if (response.success === false) {
        setAlertDesc('ข้อมูลของท่านอยูระหว่างการพิจารณาอยู');
        setAlertType('info');
      } else {
        // Fallback for any other unexpected message
        setAlertText('เกิดข้อผิดพลาด');
        setAlertDesc('การส่งข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง');
        setAlertType('error');
      }
  
      // Open the alert
      setIsAlertOpen(true);
    } catch (error) {
      // Handle any errors
      setAlertText('เกิดข้อผิดพลาด');
      setAlertDesc('ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง');
      setAlertType('error');
      setIsAlertOpen(true);
      console.error("Error sending data to API:", error);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    window.location.reload();
  };
  



  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto', my: 4 }}
      >
        <Typography color="secondary" align="center" sx={{ mt: 2 }}>
          ข้อมูลของท่านมีอยู่ในระบบแล้ว
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="studentId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="รหัสนักศึกษา"
                  {...field}
                  variant="outlined"
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ชื่อ (กรุณาใส่ชื่อเป็นภาษาอังกฤษ)"
                  {...field}
                  variant="outlined"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="สงคำรอง"
              multiline
              rows={4}
              {...register("specialRequest")}
              error={!!errors.specialRequest}
              helperText={errors.specialRequest?.message}
            />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          ส่งข้อมูล
        </Button>
      </Box>
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

export default Secondaryword;
