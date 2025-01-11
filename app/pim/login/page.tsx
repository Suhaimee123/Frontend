"use client";

import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import useLogin from '@/hooks/Admin/useLogin';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import AlertBox from '@/components/Alert/Alert';

const Page: React.FC = () => {
  const { formData, loading, error, handleChange, loginUser } = useLogin();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันฟอร์มรีเฟรชหน้าเว็บ
  
    const response = await loginUser(); // เรียกฟังก์ชัน loginUser
  
    if (response.success) { // กรณีเข้าสู่ระบบสำเร็จ
      setAlertType('success');
      setAlertText('เข้าสู่ระบบสำเร็จ');
      setIsAlertOpen(true);
  
      setTimeout(() => {
        router.push('/pim/Admin'); // เปลี่ยนเส้นทางไปยังหน้า /pim/Admin
      }, 2000); 
    } else { // กรณีเข้าสู่ระบบล้มเหลว
      setAlertType('error');
      setAlertText('การเข้าสู่ระบบล้มเหลว');
  
      // ตรวจสอบข้อความ response.message
      setAlertDesc(
        response.message === "User not found"
          ? "ไม่พบบัญชีผู้ใช้งานในระบบ กรุณาตรวจสอบอีเมลของคุณ" // กรณีไม่พบผู้ใช้งาน
          : response.message === "Invalid password provided"
          ? "รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง" // กรณีรหัสผ่านไม่ถูกต้อง
          : "เกิดข้อผิดพลาดที่ไม่คาดคิด" // กรณีอื่นๆ
      );
  
      setIsAlertOpen(true); // เปิด AlertBox
    }
  };
  
  
  

  return (
    <>
      <Layout contentTitle="Login Page">
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { xs: '90%', sm: '300px' }, margin: '0 auto' }} // Responsive width
        >
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading }
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading }
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading }>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && (
            <Typography color="error" aria-live="polite">
              {error}
            </Typography>
          )}
        </Box>
      </Layout>

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
