"use client";
import React, { useEffect, useState } from 'react';
import { getLatestScholarship, uploadFilesApi } from '@/app/api/Admin/scholarshipApi';
import AlertBox from '@/components/Alert/Alert';
import Layout from '@/components/Layout';
import CustomFileUpload from '@/components/CustomFileUpload';
import { Box, Typography, Grid, FormHelperText, Button, TextField, CircularProgress } from '@mui/material';
import { Scholarship } from '@/types/Admin/scholarship';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

const formatDate = (dateString: string): string => {
    const date = dayjs(dateString).locale('th');
    return `${date.date()} ${date.format('MMMM')} ${date.year()} เวลา ${date.format('HH:mm')}`;
};

const Page: React.FC = () => {
    const formMethods = useForm<Scholarship>();
    const { handleSubmit, register, formState: { errors }, setValue } = formMethods;

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertDesc, setAlertDesc] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [scholarshipStatus, setScholarshipStatus] = useState<'open' | 'closed'>('closed');
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestScholarship = async () => {
            try {
                const response = await getLatestScholarship();
                if (response.success && response.data) {
                    setScholarshipStatus(response.data.status);
                    setStartDate(response.data.startDate);
                    setEndDate(response.data.endDate);
                } else {
                    console.error('Error retrieving latest scholarship:', response.message);
                }
            } catch (error) {
                console.error('Error fetching latest scholarship:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestScholarship();
    }, []);

    const handleFileChange = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const updatedFiles = [newFiles[0]]; // รับเฉพาะไฟล์แรก
            setFiles(updatedFiles);
            setValue("scholarship", updatedFiles, { shouldValidate: true });
        }
    };

    const handleFileRemove = (fileToRemove: File) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        setValue("scholarship", updatedFiles, { shouldValidate: true });
    };

    const validateFiles = () => {
        if (files.length !== 1) {
            setFileError("กรุณาอัพโหลดไฟล์ PDF เพียง 1 ไฟล์");
            return false;
        }
        const invalidFiles = files.some(file => !file.name.endsWith('.pdf'));
        if (invalidFiles) {
            setFileError("กรุณาอัพโหลดไฟล์ PDF เท่านั้น");
            return false;
        }
        setFileError(null);
        return true;
    };

    const isAfterDeadline = (): boolean => {
        if (!endDate) return false;
        const currentTime = dayjs();
        const deadline = dayjs(endDate);
        return currentTime.isAfter(deadline);
    };
    const isBeforeStart = (): boolean => {
        if (!startDate) return false; 
        const currentTime = dayjs();
        const start = dayjs(startDate);
        return currentTime.isBefore(start); 
    };
    const onSubmit = async (data: Scholarship) => {
        if (!validateFiles()) return;

        try {
            setIsProcessing(true);

            const studentId = data.studentId;
            const firstName = data.firstName;

            if (!studentId || !firstName) {
                setAlertType('error');
                setAlertText('ข้อมูลไม่ครบถ้วน');
                setAlertDesc('กรุณากรอกข้อมูลให้ครบถ้วน');
                setIsAlertOpen(true);
                return;
            }

            const fileNames = files.map(file => file.name);
            const imageType = 'document';

            const response = await uploadFilesApi(files, studentId, firstName, fileNames, imageType);

            if (response.success) {
                setAlertType('success');
                setAlertText('ส่งข้อมูลสำเร็จ');
                setAlertDesc('ข้อมูลของคุณได้ถูกส่งเรียบร้อยแล้ว');
                setIsAlertOpen(true);
            } else {
                setAlertType('error');
                setAlertText('เกิดข้อผิดพลาด');
                setAlertDesc(response.message || 'ไม่สามารถส่งข้อมูลได้');
                setIsAlertOpen(true);
            }
        } catch (error) {
            console.error('Error during file upload:', error);
            setAlertType('error');
            setAlertText('เกิดข้อผิดพลาด');
            setAlertDesc('ไม่สามารถอัพโหลดไฟล์ได้');
            setIsAlertOpen(true);
        } finally {
            setIsProcessing(false);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.reload();
    };

    return (
        <>
            <Layout contentTitle="ต่อทุนการศึกษา">
                <main>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        {isLoading ? (
                            <Box>
                                <CircularProgress />
                                <Typography color="secondary" align="center" sx={{ mt: 2 }}>
                                    กำลังโหลดข้อมูลทุนการศึกษา...
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    สถานะทุนการศึกษา: {scholarshipStatus === 'open' ? 'เปิด' : 'ปิด'}
                                </Typography>

                                {startDate && endDate ? (
                                    <>
                                        <Typography variant="body1">
                                            วันที่เริ่มต้น: {formatDate(startDate)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            วันที่สิ้นสุด: {formatDate(endDate)}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body1" color="error">
                                        ไม่พบข้อมูลวันที่
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            maxWidth: 800,
                            mx: "auto",
                            my: 4,
                        }}
                    >
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="รหัสนักศึกษา"
                                {...register('studentId', { required: 'Required' })}
                                variant="outlined"
                                error={!!errors.studentId}
                                helperText={errors.studentId?.message}
                                disabled={isProcessing}
                            />
                        </Grid>
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomFileUpload
                                    value={files}
                                    onChange={handleFileChange}
                                    onRemove={handleFileRemove}
                                    accept="application/pdf"
                                />
                                {fileError && <FormHelperText error>{fileError}</FormHelperText>}
                            </Grid>
                        </Grid>

                        {scholarshipStatus === 'open' && !isAfterDeadline() && !isBeforeStart() ? (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล'}
                                </Button>
                            </Box>
                        ) : (
                            <Typography color="error" align="center" sx={{ mt: 3 }}>
                                {isAfterDeadline()
                                    ? 'หมดเวลาการส่งไฟล์แล้ว'
                                    : isBeforeStart()
                                        ? 'ยังไม่ถึงวันที่เริ่มส่งไฟล์'
                                        : 'การอัปโหลดไฟล์ปิดอยู่ในขณะนี้'}
                            </Typography>
                        )}
                    </Box>
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
