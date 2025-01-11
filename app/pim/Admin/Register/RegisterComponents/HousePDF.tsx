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

const HousePDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const { control, handleSubmit, setValue, watch } = formMethods;

    const uploadPictureHouse = watch("uploadPictureHouse");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const studentId = watch("studentId");
    const imageType = "uploadPictureHouse";
    const { loading: loadingImages, images, error: fetchImagesError, fetchStudentImages } = useStudentImages();

    const Count = useRef(0);
    const [isFetching, setIsFetching] = useState(false);
    const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

    const fetchImages = async () => {
        if (studentId && (!files.length) && !isFetching && (!uploadPictureHouse || uploadPictureHouse.length === 0)) {
            setIsFetching(true);
            try {
                await fetchStudentImages(studentId, imageType);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsFetching(false);
            }
        } else if (uploadPictureHouse && uploadPictureHouse.length > 0) {
            console.log("มีข้อมูลใน uploadPictureHouse แล้ว ไม่ต้องโหลดซ้ำ");
        }
    };

    useEffect(() => {
        fetchImages();
    }, [studentId, uploadPictureHouse]);

    useEffect(() => {
        if (images && images.length > 0) {
            const imageFilesWithMetadata = images.map((imageObj) => {
                const file = base64ToFile(imageObj.image, imageObj.name);
                return { name: imageObj.name, file, imageData: imageObj.imageData, imageType: "uploadPictureHouse" };
            });

            if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
                setFilesWithMetadata(imageFilesWithMetadata);
                setValue("uploadPictureHouse", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
                Count.current += 1;
                console.log("ครั้งที่ ", Count.current);
                console.log("imagesuploadPictureHouse ", images);
            }
        }
    }, [images, setValue, filesWithMetadata]);

    useEffect(() => {
        if (uploadPictureHouse) {
            setFiles(Array.isArray(uploadPictureHouse) ? uploadPictureHouse : Array.from(uploadPictureHouse) || []);
        } else {
            setFiles([]); // Ensure files are cleared if uploadPictureHouse is undefined
        }
    }, [uploadPictureHouse]);

    return (
        <Box
            component="form"
            sx={{
                // width: '720px',
                // height: '119vh', // ใช้ความสูงเต็มที่ของ viewport

                // mx: 'auto',
                // my: 2,
                '& .MuiGrid-item': {
                    paddingTop: '2px !important',
                    paddingBottom: '2px !important',
                }
            }}
        >
            <Box sx={{ mt: 2, position: 'relative', width: '100%' }}>
                {loadingImages ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography
                                color="secondary"
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', marginBottom:'50px' }}
                            >
                                รูปบ้านตามภูมิลำเนา
                            </Typography>
                        </Grid>
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <Grid
                                    item
                                    xs={files.length === 2 ? 12 : 6} // หากมี 2 รูปใช้ xs=12 (เต็มแถว), หากมากกว่าใช้ xs=6 (ซ้าย-ขวา)
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        sx={{
                                            width: '90%', // ขยายขนาดให้เหมาะสม
                                            maxWidth: '300px', // จำกัดความกว้างสูงสุด
                                            height: 'auto', // รักษาสัดส่วน
                                            border: '2px dashed #1976d2',
                                            borderRadius: 1,
                                            boxShadow: 2,
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography align="center">No images available</Typography>
                            </Grid>
                        )}
                    </Grid>

                )}
            </Box>
        </Box>
    );
};

export default HousePDF;