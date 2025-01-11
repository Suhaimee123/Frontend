import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Student } from '@/types/Register';
import { Box, Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import { useStudentApi } from '@/hooks/RegisterH';
import StudentUserPDF from './pdf/StudentUserPDF';
import PartOnePDF from '@/app/pim/Admin/Register/RegisterComponents/PartOnePDF';
import PartTwoPDF from '@/app/pim/Admin/Register/RegisterComponents/PartTwoPDF';
import PartThreePDF from '@/app/pim/Admin/Register/RegisterComponents/PartThreePDF';
import PartFourPDF from '@/app/pim/Admin/Register/RegisterComponents/PartFourPDF';
import AlertBox from '@/components/Alert/Alert';
import VolunteerUserPDF from './pdf/VolunteerUserPDF';
import HouseUserPDF from './pdf/HouseUserPDF';

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const FromUserpdf: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const { control, register, handleSubmit, formState: { errors }, setValue, watch } = formMethods;
    const { loading, sendStudentData, uploadFiles, sendEmail } = useStudentApi();
    const [alertText, setAlertText] = useState('');
    const [alertDesc, setAlertDesc] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Added state for alert visibility

    const onSubmit = async (data: Student) => {
        const { uploadPictureHouse, volunteerPictures, studentPicture } = data;

        if (
            (!uploadPictureHouse || uploadPictureHouse.length < 2) ||
            (!volunteerPictures || volunteerPictures.length < 1) ||
            (!studentPicture)
        ) {
            setAlertText("Missing Files");
            setAlertDesc("โปรดตรวจสอบให้แน่ใจว่าได้อัปโหลดไฟล์ที่จำเป็นทั้งหมดแล้ว");
            setAlertType("warning");
            setIsAlertOpen(true);
            return;
        }

        const { studentId, firstName } = data;

        if (!studentId || !firstName) {
            setAlertText("Missing Information");
            setAlertDesc("ไม่พบข้อมูล studentId หรือ firstName");
            setAlertType("warning");
            setIsAlertOpen(true);
            return;
        }

        const fileGroups = [
            { files: Array.from(uploadPictureHouse || []), imageType: "uploadPictureHouse" },
            { files: Array.from(volunteerPictures || []), imageType: "volunteerPictures" },
            { files: Array.from(studentPicture || []), imageType: "studentPicture" }
        ].filter(group => group.files.length > 0);

        try {
            const response = await sendStudentData(data); // Capture the response

            if (response?.data) {
                console.log("Response from sendStudentData:", response.data); // Log the response data

                // Extract necessary data from the response
                const { email, id } = response.data;

                for (const group of fileGroups) {
                    await uploadFiles(group.files, id, studentId, firstName, group.imageType);
                }

                const pdfFile = await handleDownloadPdf();
                const imageType: "PDF" = "PDF";

                if (pdfFile) {
                    await uploadFiles([pdfFile], id, studentId, firstName, imageType);
                }

                // Send email after successful uploads
                const emailResponse = await sendEmail(studentId, email, firstName);
                setAlertText("All Steps Completed");
                setAlertDesc("ข้อมูลและไฟล์ถูกอัปโหลดสำเร็จ และได้ส่งอีเมลเรียบร้อยแล้ว");
                setAlertType("success");
                setIsAlertOpen(true);

            } else {
                setAlertText("Submission Failed");
                setAlertDesc("Response data is null or undefined");
                setAlertType("error");
                setIsAlertOpen(true);
            }
        } catch (error) {
            setAlertText("Error");
            setAlertDesc("เกิดข้อผิดพลาดในการส่งข้อมูลหรืออัปโหลดไฟล์");
            setAlertType("error");
            setIsAlertOpen(true);
            console.error("Error during submission:", error);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.reload();
    };

    const handleDownloadPdf = async (): Promise<File | null> => {
        const element = document.getElementById('pdf-content');
        if (!element) return null;

        const opt = {
            margin: 0.5,
            filename: 'student-registration.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait' as 'portrait' | 'landscape'
            },
        };

        // Correct usage of html2pdf
        const pdfBlob = await html2pdf().from(element).set(opt).output('blob');

        return new File([pdfBlob], 'student-registration.pdf', { type: 'application/pdf', lastModified: Date.now() });
    };

    return (
        <>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mx: "auto",
                }}
            >
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'กำลังสง...' : 'ยื่นยัน'}
                </Button>
            </Box>
            <Box id="pdf-content" className="pdf-container" style={{ maxWidth: '210mm', margin: 'auto' }}>
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
                    <StudentUserPDF formMethods={formMethods} />
                    <PartOnePDF formMethods={formMethods} />
                    <PartTwoPDF formMethods={formMethods} />
                    <PartThreePDF formMethods={formMethods} />
                </Box>
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
                    <HouseUserPDF formMethods={formMethods} />
                </Box>
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
                    <VolunteerUserPDF formMethods={formMethods} />
                </Box>
            </Box>
            <AlertBox
                text={alertText}
                desc={alertDesc}
                type={alertType}
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
                timeoutDuration={3000}
            />
        </>
    );
};

export default FromUserpdf;
