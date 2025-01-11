import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { StudentStatus } from "@/types/Status";
import { Box, Typography, Button, CircularProgress, TextField, Grid } from "@mui/material";
import { fetchStudentStatus } from '@/app/api/CheckStatus';
import AlertBox from '@/components/Alert/Alert';

// ฟังก์ชันสำหรับแปลงสถานะ
const translateStatus = (status: string): string => {
  const statusMapping: { [key: string]: string } = {
    pending: "รอดำเนินการ",
    rejected: "ปฏิเสธ",
    approved_stage_1: "อนุมัติขั้นที่ 1",
    complete: "เสร็จสมบูรณ์"
  };
  return statusMapping[status] || "สถานะไม่ทราบ"; // หากไม่พบสถานะ
};

// ฟังก์ชันสำหรับแปลงประเภท applicationType
const translateApplicationType = (applicationType: string): string => {
  const typeMapping: { [key: string]: string } = {
    cosmetic_procedure: "ไม่ผ่านโดยระบบ",
    initial_application: "การสมัครครั้งแรก",
    special_request: "ยื่นคำรอง"
  };
  return typeMapping[applicationType] || "ประเภทไม่ทราบ"; // หากไม่พบประเภท
};

// ฟังก์ชันสำหรับแปลง specialRequest
const translateSpecialRequest = (specialRequest: string | null | undefined): string => {
  if (!specialRequest) return "ไม่มีคำร้อง";
  return "ยื่นคำร้อง";
};

// ฟังก์ชันสำหรับฟอร์แมตวันที่
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "ไม่ระบุ"; // จัดการกรณี null หรือ undefined
  if (date instanceof Date) {
    return date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
  }
  return new Date(date).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
};

// ฟังก์ชันคำนวณจำนวนเดือน
const calculateMonths = (startMonth: string | null | undefined, endMonth: string | null | undefined): string => {
  if (!startMonth || !endMonth) return "ไม่สามารถคำนวณได้";

  const [startDay, startMonthValue, startYear] = startMonth.split('/').map(Number);
  const [endDay, endMonthValue, endYear] = endMonth.split('/').map(Number);

  if (isNaN(startYear) || isNaN(startMonthValue) || isNaN(endYear) || isNaN(endMonthValue)) {
    return "ข้อมูลวันที่ไม่ถูกต้อง";
  }

  const yearsDiff = endYear + 2000 - (startYear + 2000);
  const monthsDiff = endMonthValue - startMonthValue;

  const totalMonths = yearsDiff * 12 + monthsDiff;

  if (totalMonths < 0) return "ข้อมูลวันที่ไม่ถูกต้อง";

  return `${totalMonths} เดือน`;
};

// ฟังก์ชันสำหรับข้อความเพิ่มเติมตามสถานะ
const getAdditionalMessage = (status: string): string | null => {
  const messageMapping: { [key: string]: string } = {
    rejected: "นศ. สามารถยืนคำรอง ให้ตรวจสอบเพิมเติมได้",
    complete: "นศ. โปรดแอดไลน์ พี่ไอซ์ ID: iiceziing เพื่อติดตามการรับทุนต่อไป"
  };
  return messageMapping[status] || null; // คืนข้อความพิเศษหรือ null หากไม่มี
};

const StudentStatusComponent: React.FC = () => {
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // สำหรับการแสดงสถานะการประมวลผล
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const { handleSubmit, register, formState: { errors } } = useForm<{ studentId: string }>();

  const onSubmit = async ({ studentId }: { studentId: string }) => {
    setLoading(true);
    setIsProcessing(true); // เปิดสถานะการประมวลผล
    setError(null);
  
    try {
      const data = await fetchStudentStatus(studentId);
  
      if (data.success) {
        // กรณีดึงข้อมูลสำเร็จ
        setStatuses(data.data || []); // บันทึกข้อมูลที่ได้
        setAlertText('Success');
        setAlertDesc('ค้นหาสถานะสำเร็จ'); // ใช้ข้อความจาก API หากมี
        setAlertType('success');
        setIsAlertOpen(true); // แสดง AlertBox
      } else if (data.error === "No Data Found") {
        // กรณีไม่มีข้อมูล
        setStatuses([]);
        setAlertText('ไม่พบข้อมูล');
        setAlertDesc('โปรดตรวจสอบรหัสนักศึกษาอีกครั้ง');
        setAlertType('info');
        setIsAlertOpen(true); // แสดง AlertBox
      } else if (data.error) {
        // กรณีเกิดข้อผิดพลาดอื่น ๆ จาก API
        setAlertText('พบข้อผิดพลาด');
        setAlertDesc('ไม่สามารถค้นหาสถานะได้');
        setAlertType('warning');
        setIsAlertOpen(true); // แสดง AlertBox
      }
    } catch (err: any) {
      // กรณีเกิดข้อผิดพลาดขณะเรียก API
      setError(err.message);
      setAlertText('เกิดข้อผิดพลาด');
      setAlertDesc( 'ไม่สามารถค้นหาสถานะได้');
      setAlertType('error');
      setIsAlertOpen(true); // แสดง AlertBox
    } finally {
      setLoading(false);
      setIsProcessing(false); // ปิดสถานะการประมวลผล
    }
  };
  
  

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>ตรวจสอบสถานะนักศึกษา</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="รหัสนักศึกษา"
              {...register('studentId', { required: 'กรุณากรอกรหัสนักศึกษา' })}
              variant="outlined"
              error={!!errors.studentId}
              helperText={errors.studentId?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isProcessing}
            >
              {isProcessing ? <CircularProgress size={24} /> : "ตรวจสอบสถานะ"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {isProcessing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      )}

      {!isProcessing && statuses.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">ผลการค้นหา:</Typography>
          {statuses.map((status) => (
            <Box key={status.applicationId} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography>รหัสนักศึกษา: {status.studentId}</Typography>
              <Typography>สถานะ: {translateStatus(status.status || "")}</Typography>
              <Typography>ประเภท: {translateApplicationType(status.applicationType || "")}</Typography>
              {status.specialRequest && (
                <Typography>คำร้องพิเศษ: {translateSpecialRequest(status.specialRequest)}</Typography>
              )}
              {status.submissionDate && <Typography>วันที่ส่ง: {formatDate(status.submissionDate)}</Typography>}
              {status.processedDate && <Typography>อนุมัติเมื่อวันที่: {formatDate(status.processedDate)}</Typography>}
              {status.appointmentDate && <Typography>วันนัดหมาย: {status.appointmentDate}</Typography>}
              {status.startMonth && <Typography>เดือนเริ่มต้น: {status.startMonth}</Typography>}
              {status.endMonth && <Typography>เดือนสิ้นสุด: {status.endMonth}</Typography>}
              {status.startMonth && status.endMonth && (
                <Typography>ระยะเวลา: {calculateMonths(status.startMonth, status.endMonth)}</Typography>
              )}

              {getAdditionalMessage(status.status || "") && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #4caf50', borderRadius: 2, backgroundColor: '#e8f5e9' }}>
                  <Typography color="primary" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {getAdditionalMessage(status.status || "")}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {!isProcessing && error && (
        <Typography color="error">{error}</Typography>
      )}

      <AlertBox
        text={alertText}
        desc={alertDesc}
        type={alertType}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        timeoutDuration={2000}
      />
    </Box>
  );
};

export default StudentStatusComponent;
