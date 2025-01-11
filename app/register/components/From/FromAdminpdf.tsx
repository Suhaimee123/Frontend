import React, { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Student } from '@/types/Register';
import { Box, Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import PartOnePDF from '@/app/pim/Admin/Register/RegisterComponents/PartOnePDF';
import PartTwoPDF from '@/app/pim/Admin/Register/RegisterComponents/PartTwoPDF';
import PartThreePDF from '@/app/pim/Admin/Register/RegisterComponents/PartThreePDF';
import PartFourPDF from '@/app/pim/Admin/Register/RegisterComponents/PartFourPDF';
import { FileWithMetadata } from '@/types/IResponse';
import { useStudentAdminApi } from '@/hooks/Admin/RegisterAdmin';
import AlertBox from '@/components/Alert/Alert';
import StudentPDF from '../../../pim/Admin/Register/RegisterComponents/StudentPDF';
import HousePDF from '../../../pim/Admin/Register/RegisterComponents/HousePDF';
import VolunteerPDF from '../../../pim/Admin/Register/RegisterComponents/VolunteerPDF';

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
    studentImages: FileWithMetadata[];
    setOpenPdfDialog: React.Dispatch<React.SetStateAction<boolean>>;

}

const FromAdminpdf: React.FC<RegisterFormProps> = ({ formMethods, studentImages,setOpenPdfDialog }) => {
    const { control, register, handleSubmit, formState: { errors }, setValue, watch } = formMethods;
    const { loading, sendStudentData, uploadFiles, sendEmail } = useStudentAdminApi();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertDesc, setAlertDesc] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    const onSubmit = useCallback(
        async (data: Student) => {
            const { uploadPictureHouse, volunteerPictures, studentPicture } = data;

            // ตรวจสอบว่ามีไฟล์ที่จำเป็นครบหรือไม่
            if (
                (!uploadPictureHouse || uploadPictureHouse.length < 2) ||
                (!volunteerPictures || volunteerPictures.length < 1) ||
                (!studentPicture)
            ) {
                setAlertText("Missing Files");
                setAlertDesc("โปรดตรวจสอบให้แน่ใจว่าได้อัปโหลดไฟล์ที่จำเป็นทั้งหมดแล้ว");
                setAlertType("error");
                setIsAlertOpen(true);
                return;
            }

            const { studentId, firstName } = data;

            // ตรวจสอบข้อมูลนักเรียน
            if (!studentId || !firstName) {
                setAlertText("Missing Data");
                setAlertDesc("ไม่พบข้อมูล studentId หรือ firstName");
                setAlertType("error");
                setIsAlertOpen(true);
                return;
            }

            const fileGroups = [
                { files: Array.from(uploadPictureHouse || []), imageType: "uploadPictureHouse" },
                { files: Array.from(volunteerPictures || []), imageType: "volunteerPictures" },
                { files: Array.from(studentPicture || []), imageType: "studentPicture" }
            ].filter(group => group.files.length > 0);

            try {
                const response = await sendStudentData(data);

                if (response?.data) {
                    const { email, id } = response.data;

                    for (const group of fileGroups) {
                        const filesArray: File[] = Array.isArray(group.files) ? group.files : Array.from(group.files as FileList);

                        const { matchedFiles, unmatchedFiles } = filesArray.reduce((acc, file: File) => {
                            const studentImageNames = studentImages.flatMap(img => img.name.split(',').map((name: string) => name.trim()));
                            const isFileAlreadyUploaded = studentImageNames.includes(file.name);

                            if (isFileAlreadyUploaded) {
                                acc.matchedFiles.push(file);
                            } else {
                                acc.unmatchedFiles.push(file);
                            }
                            return acc;
                        }, { matchedFiles: [] as File[], unmatchedFiles: [] as File[] });

                        if (unmatchedFiles.length > 0 || studentImages.length === 0) {
                            await uploadFiles(unmatchedFiles, id, studentId, firstName, group.imageType);
                        }
                    }

                    const pdfFile = await handleDownloadPdf();
                    const imageType: "PDF" = "PDF";

                    if (pdfFile) {
                        await uploadFiles([pdfFile], id, studentId, firstName, imageType);
                    }

                    // ส่งอีเมลหลังจากที่ทุกขั้นตอนสำเร็จ
                    const emailResponse = await sendEmail(studentId, email, firstName);

                    // แสดงข้อความสำเร็จใน AlertBox หลังจากทุกขั้นตอนเสร็จ
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

        await new Promise(resolve => setTimeout(resolve, 5000)); 
        setOpenPdfDialog(false);
        window.location.reload();
            
        },
        
        [sendStudentData, uploadFiles, sendEmail, studentImages]

        
    );


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
                    alignItems: "center",
                    marginBottom: "10px",
                }}
            >
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'กำลังสง...' : 'ยื่นยัน'}
                </Button>
            </Box>
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
                timeoutDuration={3000}
            />
        </>
    );
};

export default FromAdminpdf;
