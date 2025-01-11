import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Student } from '@/types/Register';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import html2pdf from 'html2pdf.js';
import StudentPDF from '@/app/pim/Admin/Register/RegisterComponents/StudentPDF';
import PartTwoPDF from '@/app/pim/Admin/Register/RegisterComponents/PartTwoPDF';
import PartOnePDF from '@/app/pim/Admin/Register/RegisterComponents/PartOnePDF';
import PartThreePDF from '@/app/pim/Admin/Register/RegisterComponents/PartThreePDF';
import PartFourPDF from '@/app/pim/Admin/Register/RegisterComponents/PartFourPDF';
import AlertBox from '@/components/Alert/Alert';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { submitApproval } from '@/app/api/Admin/ApiSubmitApproval';
import { submitNotApproval } from '@/app/api/Admin/submitNotApproval';
import Image from 'next/image';
import Icondownload from "/public/download.png";
import Iconapproval from "/public/approval.png";
import HousePDF from '@/app/pim/Admin/Register/RegisterComponents/HousePDF';
import VolunteerPDF from '@/app/pim/Admin/Register/RegisterComponents/VolunteerPDF';

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
    setOpenPdfDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const FromCombinedPDF: React.FC<RegisterFormProps> = ({ formMethods, setOpenPdfDialog }) => {
    const { watch } = formMethods;
    const studentId = watch("studentId");
    const status = watch("status");
    const [openDialog, setOpenDialog] = useState(false);
    const [startScholarship, setStartScholarship] = useState<Dayjs | null>(null);
    const [endScholarship, setEndScholarship] = useState<Dayjs | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<Dayjs | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertDesc, setAlertDesc] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    const handleDownloadPdf = () => {
        const element = document.getElementById('pdf-content');
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: 'student-registration.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait' as 'portrait' | 'landscape',
            },
        };

        html2pdf().from(element).set(opt).save();
    };

    const handleSubmit = async (isApproved: boolean) => {
        const applicationId = watch("applicationId") as number | undefined;
        let approvalData;

        if (status === 'approved_stage_1') {
            const formattedStartDate = isApproved && startScholarship
                ? startScholarship.format('DD/MM/YY')
                : undefined;
            const formattedEndDate = isApproved && endScholarship
                ? endScholarship.format('DD/MM/YY')
                : undefined;

            approvalData = {
                studentId,
                applicationId,
                approve: isApproved ? "Y" : "N",
                approvedBy: "admin",
                startMonth: formattedStartDate,
                endAppointmentDate: formattedEndDate,
            };
        } else {
            const formattedAppointmentDate = isApproved && appointmentDate
                ? appointmentDate.format('DD/MM/YY HH:mm')
                : undefined;

            approvalData = {
                studentId,
                applicationId,
                approve: isApproved ? "Y" : "N",
                approvedBy: "admin",
                appointmentDate: formattedAppointmentDate,
            };
        }

        try {
            const submitFunction = status === 'pending' || status === 'approved_stage_1'
                ? submitApproval
                : submitNotApproval;

            const result = await submitFunction(approvalData);

            if (result.success) {
                setAlertText("การส่งข้อมูลสำเร็จ");
                setAlertDesc("การส่งข้อมูลของคุณสำเร็จแล้ว");
                setAlertType("success");
            } else {
                setAlertText("การส่งข้อมูลล้มเหลว");
                setAlertDesc("การส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบและลองใหม่อีกครั้ง");
                setAlertType("error");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดระหว่างการส่งข้อมูล:", error);
            setAlertText("การส่งข้อมูลล้มเหลว");
            setAlertDesc("เกิดข้อผิดพลาดในการประมวลผลคำขอ กรุณาลองใหม่อีกครั้ง");
            setAlertType("error");
        }

        setOpenDialog(false);
        setIsAlertOpen(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setOpenPdfDialog(false);
        window.location.reload();
    };


    return (
        <>
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadPdf}
                    startIcon={
                        <Image
                            src={Icondownload}
                            alt="Download Icon"
                            width={24}
                            height={24}
                            style={{ filter: 'invert(1)' }}
                        />
                    }
                >
                    PDF
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setOpenDialog(true)}
                    disabled={status === 'complete'}
                    startIcon={
                        <Image
                            src={Iconapproval}
                            alt="Iconapproval Icon"
                            width={24}
                            height={24}
                            style={{ filter: 'invert(1)' }}
                        />
                    }
                    sx={{
                        backgroundColor: status === 'complete' ? 'grey' : 'green',
                        color: status === 'complete' ? 'white' : 'white',
                        '&:hover': {
                            backgroundColor: status === 'complete' ? 'grey' : 'darkgreen',
                        },
                    }}
                >
                    ยืนยัน
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {status === 'approved_stage_1'
                        ? `กำหนดวันเริ่มและสิ้นสุดสำหรับนักศึกษา ${studentId}`
                        : `กำหนดวันและเวลานัดหมายสำหรับนักศึกษา ${studentId}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {status === 'approved_stage_1' ? (
                            <>
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                                        <DatePicker
                                            label="เริ่มรับทุน"
                                            value={startScholarship}
                                            onChange={(newValue) => setStartScholarship(newValue)}
                                            views={['year', 'month']}
                                            slotProps={{
                                                textField: { fullWidth: true },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                                        <DatePicker
                                            label="สิ้นสุด"
                                            value={endScholarship}
                                            onChange={(newValue) => setEndScholarship(newValue)}
                                            views={['year', 'month']}
                                            slotProps={{
                                                textField: { fullWidth: true },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                                    <DateTimePicker
                                        label="วันและเวลานัดหมาย"
                                        value={appointmentDate}
                                        onChange={(newValue) => setAppointmentDate(newValue)}
                                        ampm={false}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        )}
                        <Grid item xs={6}>
                            <Button
                                onClick={() => handleSubmit(true)}
                                fullWidth
                                color="primary"
                                variant="contained"
                                disabled={
                                    status === 'approved_stage_1'
                                        ? !startScholarship || !endScholarship
                                        : !appointmentDate
                                }
                            >
                                อนุมัติ
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => handleSubmit(false)}
                                fullWidth
                                color="error"
                                variant="contained"
                                disabled={status === 'rejected'} // Add status check here

                            >
                                ปฏิเสธ
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>


            <Box id="pdf-content" className="pdf-container" style={{ maxWidth: '210mm', margin: 'auto' }}>
                {/* StudentPDF Section */}
                <Box
                    className="pdf-page"
                    style={{
                        width: '210mm',
                        height: '297mm', // A4 height
                        padding: '10mm', // Inner padding for content
                        boxSizing: 'border-box', // Ensure padding doesn't overflow
                        // marginBottom: '10px',
                        // border: '1px solid #ddd', // Optional border for debug
                        overflow: 'hidden', // Prevent content overflow
                    }}
                >
                    <StudentPDF formMethods={formMethods} />
                    <PartOnePDF formMethods={formMethods} />
                    <PartTwoPDF formMethods={formMethods} />
                    <PartThreePDF formMethods={formMethods} />
                </Box>

                {/* PartFourPDF Section */}
                <Box
                    className="pdf-page"
                    style={{
                        width: '210mm',
                        height: '297mm', // A4 height
                        // padding: '10mm',
                        boxSizing: 'border-box',
                        // marginBottom: '10px',
                        // border: '1px solid #ddd',
                        overflow: 'hidden',
                    }}
                >
                    <PartFourPDF formMethods={formMethods} />
                </Box>

                {/* HousePDF Section */}
                <Box
                    className="pdf-page"
                    style={{
                        width: '210mm',
                        height: '297mm', // A4 height
                        // padding: '10mm',
                        boxSizing: 'border-box',
                        // marginBottom: '10px',
                        // border: '1px solid #ddd',
                        overflow: 'hidden',
                    }}
                >
                    <HousePDF formMethods={formMethods} />
                </Box>

                {/* VolunteerPDF Section */}
                <Box
                    className="pdf-page"
                    style={{
                        width: '210mm',
                        height: '295mm', // A4 height
                        // padding: '10mm',
                        boxSizing: 'border-box',
                        // marginBottom: '10px',
                        // border: '1px solid #ddd',
                        overflow: 'hidden',
                    }}
                >
                    <VolunteerPDF formMethods={formMethods} />
                </Box>
            </Box>


            <AlertBox
                text={alertText}
                desc={alertDesc}
                type={alertType}
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
                timeoutDuration={5000}
            />
        </>
    );
};

export default FromCombinedPDF;
