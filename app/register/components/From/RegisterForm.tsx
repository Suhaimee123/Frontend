import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Grid, InputAdornment, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Student } from "@/types/Register";
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import AlertBox from '@/components/Alert/Alert';

import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { faculties, Faculty, fieldsOfStudy, } from '@/types/university';



interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = formMethods;
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | ''>('');
  const [otherPlace, setOtherPlace] = useState('');

  const placeOfStudy = watch('placeOfStudy');


  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0];
  //   setValue('dateOfBirth', today);
  // }, [setValue]);

  // useEffect(() => {
  //   const currentDate = dayjs().locale("th").format("DD/MM/YYYY");
  //   setValue('dateOfBirth', currentDate);
  // }, [setValue]);

  const onSubmit = (data: Student) => {
    console.log('Form Data:', data);
  };

  // Watch faculty field to update selectedFaculty
  const faculty = watch('faculty');
  useEffect(() => {
    if (faculty && faculties.some(f => f.value === faculty)) {
      setSelectedFaculty(faculty as Faculty);
    } else {
      setSelectedFaculty(''); // Reset if not valid
    }
  }, [faculty]);

  // Type guard function to ensure selectedFaculty is a valid Faculty
  const selectedFields = selectedFaculty ? fieldsOfStudy[selectedFaculty] : [];
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', my: 4 }}
    >
      <Typography color="secondary" align="center" sx={{ mt: 2 }}>
        ข้อมูลของท่านยังไม่มีในระบบ
      </Typography>

      <Grid container spacing={2}>
        {/* Student ID Field */}
        <Grid item xs={12} md={6}>
          <Controller
            name="studentId"
            control={control}
            defaultValue=""
            rules={{ required: "รหัสนักศึกษาคือข้อมูลที่จำเป็น" }}
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
                InputLabelProps={{ shrink: true, required: true }}
              />
            )}
          />
        </Grid>

        {/* First Name Field */}
        <Grid item xs={12} md={6}>
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: "กรุณากรอกชื่อ" }}

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
                InputLabelProps={{ shrink: true, required: true }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>คำนำหน้า</InputLabel>
            <Controller
              name="prefix"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกคำนำหน้า" }}
              render={({ field }) => (
                <Select
                  label="คำนำหน้า"
                  {...field}
                  error={!!errors.prefix}
                >
                  <MenuItem value="นาย">นาย</MenuItem>
                  <MenuItem value="นางสาว">นางสาว</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>


        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ชื่อ (ภาษาไทย) *"
            {...register('thaiName', { required: 'กรุณากรอกชื่อภาษาไทย' })}
            variant="outlined"
            error={!!errors.thaiName}
            helperText={errors.thaiName?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="นามสกุล *"
            {...register('lastName', { required: 'กรุณากรอกนามสกุล' })}
            variant="outlined"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}

          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ชือเล่น *"
            {...register('nickname', { required: 'กรุณากรอกชื่อเล่น' })}
            variant="outlined"
            error={!!errors.nickname}
            helperText={errors.nickname?.message}

          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th"> {/* Set Thai locale */}
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกวันเกิด" }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="วันเกิด"
                  {...field}
                  views={['year', 'month', 'day']} // Day, Month, Year views
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                  onChange={(date) => field.onChange(date?.locale("th").format("DD/MM/YYYY"))} // Format in Thai
                  value={field.value ? dayjs(field.value, "DD/MM/YYYY").locale("th") : null} // Parse with Thai locale
                />
              )}
            />
          </LocalizationProvider>
        </Grid>



        {/* Gender Field */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>เพศ</InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกเพศ" }}
              render={({ field }) => (
                <Select
                  label="เพศ"
                  {...field}
                  error={!!errors.gender}
                >
                  <MenuItem value="ชาย">ชาย</MenuItem>
                  <MenuItem value="หญิง">หญิง</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>นักศึกษาที่มี Block เฉพาะคณะ BA LTM FBM เท่านั้น</InputLabel>
            <Controller
              name="block"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือก Block" }}
              render={({ field }) => (
                <Select
                  label="นักศึกษาที่มี Block เฉพาะคณะ BA LTM FBM เท่านั้น"
                  {...field}
                  error={!!errors.block}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="ไม่มี">ไม่มี</MenuItem>
                  <MenuItem value="ไม่ทราบ">ไม่ทราบ</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>กำลังศึกษาอยู่ปี</InputLabel>
            <Controller
              name="currentlyStudyingYear"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกกำลังศึกษาอยู่ปี" }}
              render={({ field }) => (
                <Select
                  label="กำลังศึกษาอยู่ปี"
                  {...field}
                  error={!!errors.currentlyStudyingYear}
                >
                  <MenuItem value="1">กำลังศึกษาอยู่ปี 1</MenuItem>
                  <MenuItem value="2">กำลังศึกษาอยู่ปี 2</MenuItem>
                  <MenuItem value="3">กำลังศึกษาอยู่ปี 3</MenuItem>
                  <MenuItem value="4">กำลังศึกษาอยู่ปี 4</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>ประเภทนักศึกษา</InputLabel>
            <Controller
              name="studentType"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกประเภทนักศึกษา" }}
              render={({ field }) => (
                <Select
                  label="ประเภทนักศึกษา"
                  {...field}
                  error={!!errors.studentType}
                >
                  <MenuItem value="โครงการโรงเรียนพี่โรงเรียนน้อง">โครงการโรงเรียนพี่โรงเรียนน้อง</MenuItem>
                  <MenuItem value="นักศึกษาสถาบันการจัดการปัญญาภิวัฒน์ (Walkin)">นักศึกษาสถาบันการจัดการปัญญาภิวัฒน์ (Walkin)</MenuItem>

                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>สถานที่เรียน</InputLabel>
            <Controller
              name="placeOfStudy"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกสถานที่เรียน" }}
              render={({ field }) => (
                <Select
                  label="สถานที่เรียน"
                  {...field}
                  error={!!errors.placeOfStudy}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(e);
                    if (value !== 'อื่นๆโปรดระบุ') {
                      setValue('otherPlace', '');  // Clear the otherPlace field
                    }
                  }}
                >
                  <MenuItem value="แจ้งวัฒนะ">แจ้งวัฒนะ</MenuItem>
                  <MenuItem value="วิทยาเขต EEC">วิทยาเขต EEC</MenuItem>
                  <MenuItem value="อื่นๆโปรดระบุ">อื่นๆโปรดระบุ</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {placeOfStudy === 'อื่นๆโปรดระบุ' && (
          <Grid item xs={12} md={6}>
            <Controller
              name="otherPlace"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="โปรดระบุสถานที่เรียนอื่นๆ"
                  {...field}
                  variant="outlined"
                  error={!!errors.otherPlace}
                  helperText={errors.otherPlace?.message}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="เกรดเฉลี่ยสะสมปัจจุบัน *"
            {...register('currentGpa', { required: "กรุณากรอกเกรดเฉลี่ยสะสมปัจจุบัน" })}
            variant="outlined"
            error={!!errors.currentGpa}
            helperText={errors.currentGpa?.message}
          />
        </Grid>


        {/* Faculty Field */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>คณะ</InputLabel>
            <Controller
              name="faculty"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกคณะ" }}
              render={({ field }) => (
                <Select
                  label="คณะ"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value as Faculty;
                    field.onChange(e);
                    setSelectedFaculty(value);
                  }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 224, overflow: 'auto' } } }}
                  error={!!errors.faculty}
                >
                  {faculties.map((faculty) => (
                    <MenuItem key={faculty.value} value={faculty.value}>
                      {faculty.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Field of Study Field */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>สาขาวิชา</InputLabel>
            <Controller
              name="fieldOfStudy"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณาเลือกสาขาวิชา" }}
              render={({ field }) => (
                <Select
                  label="สาขาวิชา"
                  {...field}
                  MenuProps={{ PaperProps: { style: { maxHeight: 224, overflow: 'auto' } } }}
                  error={!!errors.fieldOfStudy}
                >
                  {selectedFields.map((option: string, index: number) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Phone Number Field */}
        <Grid item xs={12} md={6}>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            rules={{
              required: 'หมายเลขโทรศัพท์เป็นข้อมูลที่จำเป็น',
              pattern: {
                value: /^\d{10}$/,
                message: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
              },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="หมายเลขโทรศัพท์ *"
                {...field}
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, '');
                  field.onChange(value); 
                }}
              />
            )}
          />
        </Grid>

        {/* National ID Field */}
        <Grid item xs={12} md={6}>
          <Controller
            name="nationalId"
            control={control}
            defaultValue=""
            rules={{
              required: 'หมายเลขบัตรประชาชนเป็นข้อมูลที่จำเป็น',
              pattern: {
                value: /^\d{13}$/,
                message: 'หมายเลขบัตรประชาชนต้องมี 13 หลัก',
              },
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                label="หมายเลขบัตรประชาชน *"
                {...field}
                variant="outlined"
                error={!!errors.nationalId}
                helperText={errors.nationalId?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="email *"
            {...register('email', {
              required: "กรุณากรอกอีเมล",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "อีเมลต้องมีรูปแบบที่ถูกต้อง (เช่น example@domain.com)"
              }
            })}
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>


        {/* Submit Button */}
        {/* <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            ส่งข้อมูล
          </Button>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default RegisterForm;
