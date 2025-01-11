import { Student } from "@/types/Register";
import { Box, Grid, Typography, FormHelperText, CircularProgress } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import CustomFileUpload from "@/components/CustomFileUpload";
import { useStudentImages } from "@/hooks/Admin/useStudentImages";
import { useDeleteStudentImage } from "@/hooks/Admin/useDeleteStudentImage";
import { FileWithMetadata } from "@/types/IResponse";
import { base64ToFile } from "@/components/base64ToFile";

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
    onImagesUpdate: (images: any[]) => void; // Add the onImagesUpdate prop

    
}

const StudentTenImg: React.FC<RegisterFormProps> = ({ formMethods ,onImagesUpdate  }) => {
    const { control, handleSubmit, setValue, watch } = formMethods;

    const studentPicture = watch("studentPicture");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const studentId = watch("studentId");
    const imageType = "studentPicture";
    const { loading: loadingImages, images, error: fetchImagesError, fetchStudentImages } = useStudentImages();
    const { fetchDeleteStudent, isLoading: deletingImageLoading, error: deleteImageError, successMessage } = useDeleteStudentImage();
    
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
                // console.log("imageData:", imageObj.imageData);
                const file = base64ToFile(imageObj.image, imageObj.name);
                return { name: imageObj.name,file, imageData: imageObj.imageData, imageType: "studentPicture" }; // Assuming a fixed imageType
            });

            if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
                setFilesWithMetadata(imageFilesWithMetadata);
                setValue("studentPicture", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
                Count.current += 1; 
                console.log("ครั้งที่ ", Count.current);
                console.log("imagestudentPicture ", images);
                onImagesUpdate(images); // Call the callback to pass images back

            }
        }
    }, [images, setValue, filesWithMetadata ,onImagesUpdate]);
    
    useEffect(() => {
        if (studentPicture) {
            setFiles(Array.isArray(studentPicture) ? studentPicture : Array.from(studentPicture) || []);
        } else {
            setFiles([]); // Ensure files are cleared if studentPicture is undefined
        }
    }, [studentPicture]);

    const handleFileChange = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        console.log("studentPictureFileChange",updatedFiles)

        setValue("studentPicture", updatedFiles, { shouldValidate: true });
    };

    const handleFileRemove = async (fileToRemove: File) => {
        const matchedFile = filesWithMetadata.find(item => item.file.name === fileToRemove.name);
    
        if (matchedFile) {
            console.log("Removing file with matching imageData:", matchedFile.imageData);
            const response = await fetchDeleteStudent(matchedFile.imageData);
            if (response.success) {
                console.log("File deleted successfully:", matchedFile.file.name);
            } else {
                console.error("Failed to delete file:", response.error);
            }
        } else {
            console.log("No matching imageData found for file:", fileToRemove.name);
        }
    
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        setValue("studentPicture", updatedFiles, { shouldValidate: true });
    };
    



    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 800,
                mx: "auto",
                my: 4,
            }}
        >
            <Typography color="secondary" align="center" sx={{ mt: 2 }}>
                อัพโหลดรูปนักศึกษา 1 รูป เป็นรูปหน้าตรง เห็นหน้าชัดเจน ไม่สวมแว่นกันแดดหรือแมสปิดใบหน้า
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomFileUpload
                        value={files}
                        multiple
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        accept="image/*"
                    />
                    {fileError && <FormHelperText error>{fileError}</FormHelperText>}
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary" align="center">
                    รูปภาพที่อัพโหลด
                </Typography>
                {loadingImages ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <Grid item xs={4} key={index}>
                                    <Box
                                        component="img"
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 1,
                                            boxShadow: 1,
                                        }}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Typography align="center">No images available</Typography>
                        )}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default StudentTenImg;
