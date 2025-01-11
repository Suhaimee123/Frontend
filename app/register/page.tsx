"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { TextField, Box, Button, Grid, Typography, CircularProgress } from '@mui/material';
import { Register } from '@/app/api/Register'; // Ensure this path is correct
import Secondaryword from './components/Secondaryword';
import Checkstatus from './components/Checkstatus';
import { Student } from "@/types/Register";
import { Controller, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import AlertBox from '@/components/Alert/Alert';

const CustomTabCards = dynamic(() => import('./components/CustomTabCards'), { ssr: false });



const Page: React.FC = () => {
  const formMethods = useForm<Student>();
  const { handleSubmit, register, formState: { errors } ,control} = formMethods;
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string>('Register'); // Default is "Register"
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');


  const handleSidebarClick = (formName: string) => {
    setSelectedForm(formName);
    setFormSubmitted(false); // Reset form submission state when changing forms
    setError(null); // Reset error message when changing forms
    setStudentDetails(null); // Reset student details when changing forms
  };


  const onSubmit = async (data: Student) => {
    setIsProcessing(true); // เริ่มการประมวลผล
    setError(null); // รีเซ็ต Error ก่อนเริ่มการทำงาน

    if (!data.studentId || !data.firstName) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setIsProcessing(false); // หยุดการประมวลผล
      return;
    }

    try {
      setIsLoading(true);
      const result = await Register(data.studentId, data.firstName);

      if (result.success) {
        if (result.message === "Student found") {
          setStudentDetails(result.data || null);
          setFormSubmitted(true);
          setAlertType('info');
          setAlertText('ข้อมูลของคุณมีในระบบแล้ว');
          setIsAlertOpen(true);
        } else if (result.message === "StudentId exists but firstName does not match") {
          setStudentDetails(null);
          setAlertType('warning');
          setAlertText('รหัสนักศึกษาไม่ตรงกับชื่อ');
          setAlertDesc('กรุณาตรวจสอบชื่อและรหัสนักศึกษา');
          setIsAlertOpen(true);
        }
      } else {
        setStudentDetails(null);
        setFormSubmitted(true);
        setAlertType('info');
        setAlertText('ไม่พบข้อมูลนักเรียน');
        setAlertDesc('หรือมีรหัสนักศึกษาเดิม');
        setIsAlertOpen(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertText('เกิดข้อผิดพลาด');
      setAlertDesc('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
      setIsProcessing(false); // เสร็จสิ้นการประมวลผล
      console.log({
        isProcessing,
        formSubmitted,
        error,
        studentDetails,
      });
    }
  };




  return (
    <>
      <Layout
        contentTitle="ใบสมัครขอรับทุน PIM SMART"
        sidebarItems={[
          {
            text: 'สมัคร',
            hook: () => handleSidebarClick('Register') // Show form on clicking "สมัคร"
          },
          {
            text: 'ตรวจสอบสถานะ',
            hook: () => handleSidebarClick('Checkstatus') // Show Checkstatus on clicking "ตรวจสอบสถานะ"
          }
        ]}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            // paddingTop: 4,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              padding: 2,
              // paddingTop: 3,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {/* Show Checkstatus component only if selected */}
            {selectedForm === 'Checkstatus' && <Checkstatus />}


            {/* Conditionally render the form and other components only if "Register" is selected */}
            {selectedForm === 'Register' && (
              <>
                {!formSubmitted && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                      {/* First Section */}
                      <Grid item xs={12} >
                        <Controller
                          name="studentId"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: 'รหัสนักศึกษาเป็นข้อมูลที่จำเป็น',
                            pattern: {
                              value: /^\d{10}$/,
                              message: 'รหัสนักศึกษาต้องมี 10 หลักและตัวเลขเท่านั้น',
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              label="รหัสนักศึกษา *"
                              {...field}
                              variant="outlined"
                              error={!!errors.studentId}
                              helperText={errors.studentId?.message}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\s+/g, '');
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Second Section */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="ชื่อ (กรุณาใส่ชื่อเป็นภาษาอังกฤษและไม่ต้องใส่นามสกุล)"
                          {...register('firstName', {
                            required: 'Required',
                            pattern: {
                              value: /^[A-Za-z\s]+$/,
                              message: 'Only English letters are allowed'
                            }
                          })}
                          variant="outlined"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          disabled={isProcessing}

                        />
                      </Grid>

                      {/* Error Message */}
                      {error && (
                        <Grid item xs={12}>
                          <Typography color="error" align="center">
                            {error}
                          </Typography>
                        </Grid>
                      )}

                      {/* Submit Button */}
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          disabled={isLoading || isProcessing} // ปิดการใช้งานเมื่อกำลังประมวลผล
                        >
                          {isLoading ? <CircularProgress size={24} /> : 'ส่งข้อมูล'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}

                {/* Conditional Rendering */}
                {!isProcessing && formSubmitted && !error && studentDetails ? (
                  <Secondaryword formMethods={formMethods} />
                ) : (
                  !isProcessing && formSubmitted && !error && studentDetails === null && (
                    <CustomTabCards formMethods={formMethods} />
                  )
                )}

              </>
            )}
          </Box>
        </Box>

        <main>
          {/* Additional content can go here */}
        </main>
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
