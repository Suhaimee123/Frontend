import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import locationData from '@/components/ThaiPostcode/thailand-province-district-subdistrict-zipcode.json';

import { Location, Student } from '@/types/Register';
import { Controller, UseFormReturn } from 'react-hook-form';

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const locations: Location[] = (locationData as any[]).map(item => ({
  province: item.province,
  district: item.district,
  subdistrict: item.subdistrict,
  zipcode: item.zipcode.toString()
}));

const Addresses: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = formMethods;

  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subdistricts, setSubdistricts] = useState<string[]>([]);

  const currentProvince = watch('province');
  const currentDistrict = watch('district');

  useEffect(() => {
    const provincesArray = Array.from(new Set(locations.map(location => location.province)));
    setProvinces(provincesArray);
  }, []);

  useEffect(() => {
    if (currentProvince) {
      updateDistricts(currentProvince);
    }
  }, [currentProvince]);

  useEffect(() => {
    if (currentDistrict) {
      updateSubdistricts(currentDistrict);
    }
  }, [currentDistrict]);

  const handleZipcodeChange = (zipcode: string) => {
    const foundLocation = locations.find(location => location.zipcode === zipcode);

    if (foundLocation) {
      const { province, district, subdistrict } = foundLocation;
      setValue('province', province);
      setValue('district', district);
      setValue('subdistrict', subdistrict);
    } else {
      setValue('province', '');
      setValue('district', '');
      setValue('subdistrict', '');
    }
  };

  const updateDistricts = (province: string) => {
    const districtsArray = Array.from(new Set(
      locations.filter(location => location.province === province)
        .map(location => location.district)
    ));
    setDistricts(districtsArray);
    setSubdistricts([]);
  };

  const updateSubdistricts = (district: string) => {
    const subdistrictsArray = Array.from(new Set(
      locations.filter(location => location.district === district)
        .map(location => location.subdistrict)
    ));
    setSubdistricts(subdistrictsArray);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValue(name as keyof Student, value);
    if (name === 'postalCode') {
      handleZipcodeChange(value);
    }
  };

  const handleSelectChange = (name: keyof Student, value: string) => {
    setValue(name, value);
    if (name === 'province') {
      updateDistricts(value);
    } else if (name === 'district') {
      updateSubdistricts(value);
    }
  };

  const onSubmit = (data: Student) => {
    console.log('Submitted data:', data);
    // Handle form submission logic here
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', my: 4 }}
    >
      <Typography color="secondary" align="center" sx={{ mt: 2 }}>
        ข้อมูลที่อยู่
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ที่อยู่ปัจจุบัน ชื่อที่พัก หอพักขณะเรียน *"
            {...register('currentAddress', { required: 'กรุณากรอกที่อยู่ปัจจุบัน' })}
            variant="outlined"
            error={!!errors.currentAddress}
            helperText={errors.currentAddress?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>นักศึกษาพักอยู่</InputLabel>
            <Controller
              name="studentResident"
              control={control}
              defaultValue=""
              rules={{ required: 'กรุณาเลือกที่พักของนักศึกษา' }}
              render={({ field }) => (
                <Select
                  label="นักศึกษาพักอยู่"
                  {...field}
                  error={!!errors.studentResident}
                >
                  <MenuItem value="บ้านตนเอง">บ้านตนเอง</MenuItem>
                  <MenuItem value="บ้านญาติ">บ้านญาติ</MenuItem>
                  <MenuItem value="บ้านเช่า/หอพัก">บ้านเช่า/หอพัก</MenuItem>
                  <MenuItem value="ยังไม่มี">ยังไม่มี (กรณีนักศึกษาใหม่ยังไม่หาหอ)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="จำนวนผู้พักอาศัย (หอพัก) *"
            {...register('numberOfResidents', { required: 'กรุณากรอกจำนวนผู้พักอาศัย' })}
            variant="outlined"
            error={!!errors.numberOfResidents}
            helperText={errors.numberOfResidents?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ที่อยู่ตามทะเบียนบ้าน *"
            {...register('addressAccordingToHouseRegistration', { required: 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน' })}
            variant="outlined"
            error={!!errors.addressAccordingToHouseRegistration}
            helperText={errors.addressAccordingToHouseRegistration?.message}

          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="รหัสไปรษณีย์ *"
            {...register('postalCode', {
              required: 'กรุณากรอกรหัสไปรษณีย์',
              maxLength: { value: 5, message: 'รหัสไปรษณีย์ต้องมี 5 หลัก' },
              onChange: handleInputChange, // ยังเก็บฟังก์ชันเดิมไว้
            })}
            variant="outlined"
            error={!!errors.postalCode}
            helperText={errors.postalCode?.message}
            inputProps={{ maxLength: 5 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>จังหวัด</InputLabel>
            <Controller
              name="province"
              control={control}
              rules={{ required: 'กรุณาเลือกจังหวัด' }} // เพิ่ม validation
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  label="จังหวัด"
                  onChange={(event) => handleSelectChange('province', event.target.value)} // เก็บฟังก์ชันเดิม
                  value={field.value}
                  error={!!errors.province} // แสดง error ถ้ามี
                >
                  {provinces.map(province => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>อำเภอ</InputLabel>
            <Controller
              name="district"
              control={control}
              rules={{ required: 'กรุณาเลือกอำเภอ' }} // เพิ่ม validation
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  label="อำเภอ"
                  onChange={(event) => handleSelectChange('district', event.target.value)} // เก็บฟังก์ชันเดิม
                  value={field.value}
                  error={!!errors.district} // แสดง error ถ้ามี
                >
                  {districts.map(district => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>ตำบล</InputLabel>
            <Controller
              name="subdistrict"
              control={control}
              rules={{ required: 'กรุณาเลือกตำบล' }} // เพิ่ม validation
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  label="ตำบล"
                  onChange={(event) => handleSelectChange('subdistrict', event.target.value)} // เก็บฟังก์ชันเดิม
                  value={field.value}
                  error={!!errors.subdistrict} // แสดง error ถ้ามี
                >
                  {subdistricts.map(subdistrict => (
                    <MenuItem key={subdistrict} value={subdistrict}>
                      {subdistrict}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

      </Grid>
      {/* <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Update
      </Button> */}
    </Box>
  );
};

export default Addresses;
