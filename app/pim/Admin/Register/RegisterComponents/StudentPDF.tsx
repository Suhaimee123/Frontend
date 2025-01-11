import { Student } from "@/types/Register";
import { Box, Grid, Typography, FormHelperText, CircularProgress } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useStudentImages } from "@/hooks/Admin/useStudentImages";
import { FileWithMetadata } from "@/types/IResponse";
import { base64ToFile } from "@/components/base64ToFile";
import Panyapiwat from "/public/Panyapiwat.jpg";
import Pimsmart from "/public/Pimsmart.jpg";

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StudentPDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const { control, handleSubmit, setValue, watch } = formMethods;

    const studentPicture = watch("studentPicture");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const studentId = watch("studentId");
    const imageType = "studentPicture";
    const { loading: loadingImages, images, error: fetchImagesError, fetchStudentImages } = useStudentImages();

    const Count = useRef(0);
    const [isFetching, setIsFetching] = useState(false);
    const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

    const fetchImages = async () => {
        if (studentId && (!files.length) && !isFetching && (!studentPicture || studentPicture.length === 0)) {
            setIsFetching(true);
            try {
                await fetchStudentImages(studentId, imageType);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsFetching(false);
            }
        } else if (studentPicture && studentPicture.length > 0) {
            console.log("มีข้อมูลใน studentPicture แล้ว ไม่ต้องโหลดซ้ำ");
        }
    };

    useEffect(() => {
        fetchImages();
    }, [studentId, studentPicture]);

    useEffect(() => {
        if (images && images.length > 0) {
            const imageFilesWithMetadata = images.map((imageObj) => {
                const file = base64ToFile(imageObj.image, imageObj.name);
                return { name: imageObj.name, file, imageData: imageObj.imageData, imageType: "studentPicture" };
            });

            if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
                setFilesWithMetadata(imageFilesWithMetadata);
                setValue("studentPicture", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
                Count.current += 1;
                console.log("ครั้งที่ ", Count.current);
                console.log("imagestudentPicture ", images);
            }
        }
    }, [images, setValue, filesWithMetadata]);

    useEffect(() => {
        if (studentPicture) {
            setFiles(Array.isArray(studentPicture) ? studentPicture : Array.from(studentPicture) || []);
        } else {
            setFiles([]); // Ensure files are cleared if studentPicture is undefined
        }
    }, [studentPicture]);

    return (
        <Box
            component="form"
            // sx={{
            //     display: "flex",
            //     flexDirection: "column",
            //     gap: 2,
            //     maxWidth: 800,
            //     height: '14vh', // ใช้ความสูงเต็มที่ของ viewport
            //     mx: "auto",
            //     // my: 4,
            // }}
        >
            <Box sx={{ mt: 2, position: 'relative', width: '100%'}}>
                {loadingImages ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box
                                // sx={{
                                //     display: 'flex',
                                //     justifyContent: 'center', // Center horizontally
                                //     alignItems: 'center', // Center vertically
                                //     height: '100%', // Full height for centering
                                // }}
                            >
                                <Box
                                    component="img"
                                    src={Pimsmart.src}
                                    alt="Pimsmart"
                                    sx={{
                                        width: '70%', // Adjust as necessary
                                        height: 'auto',
                                        maxWidth: '300px', // Set a max width if needed
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center', // Center horizontally
                                    alignItems: 'center', // Center vertically
                                    // height: '100%', // Full height for centering
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Panyapiwat.src}
                                    alt="Panyapiwat"
                                    sx={{
                                        width: '30%', // Adjust as necessary
                                        height: 'auto',
                                        maxWidth: '300px', // Set a max width if needed
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center', // Center horizontally
                                            alignItems: 'center', // Center vertically
                                            height: '80%', // Full height for centering
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            sx={{
                                                width: '130px',
                                                height: '130px',
                                                border: '2px dashed #1976d2',
                                                borderRadius: 1,
                                                boxShadow: 1,
                                            }}
                                        />
                                    </Box>
                                ))
                            ) : (
                                <Typography align="center">No images available</Typography>
                            )}
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default StudentPDF;
