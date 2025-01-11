import { Student } from "@/types/Register";
import { Box, Grid, Typography, Button, FormHelperText, TextField, CircularProgress } from "@mui/material";
import { UseFormReturn, Controller, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import CustomFileUpload from "@/components/CustomFileUpload";
import { useStudentImages } from "@/hooks/Admin/useStudentImages";
import { useDeleteStudentImage } from "@/hooks/Admin/useDeleteStudentImage";
import { FileWithMetadata } from "@/types/IResponse";
import { base64ToFile } from "@/components/base64ToFile";

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
    onImagesUpdate: (images: any[]) => void;

}




const StudentTwelveImg: React.FC<RegisterFormProps> = ({ formMethods ,onImagesUpdate }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,

    } = formMethods;

    const volunteerPictures = watch("volunteerPictures");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const studentId = watch("studentId");
    const imageType = "volunteerPictures";
    const { loading: loadingImages, images, error: fetchImagesError, fetchStudentImages } = useStudentImages();
    const { fetchDeleteStudent, isLoading: deletingImageLoading, error: deleteImageError, successMessage } = useDeleteStudentImage();
    const [isFetching, setIsFetching] = useState(false);
    const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

    const fetchImages = async () => {
        if (studentId && (!files.length) && !isFetching && (!volunteerPictures || volunteerPictures.length === 0)) {
            setIsFetching(true);
            try {
                await fetchStudentImages(studentId, imageType);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsFetching(false);
            }
        } else if (volunteerPictures && volunteerPictures.length > 0) {
            console.log("มีข้อมูลใน volunteerPictures แล้ว ไม่ต้องโหลดซ้ำ");
        }
    };
    
    // Automatically call fetchImages whenever studentId changes
    useEffect(() => {
        fetchImages();
    }, [studentId, volunteerPictures]); 
    
    useEffect(() => {
        if (images && images.length > 0) {
            const imageFilesWithMetadata = images.map((imageObj) => {
                // console.log("imageData:", imageObj.imageData); // Log imageData for each imageObj
                const file = base64ToFile(imageObj.image, imageObj.name);
                return { name: imageObj.name,file, imageData: imageObj.imageData, imageType: "volunteerPictures" }; // Assuming a fixed imageType
            });
    
            // Check if files are different and update state
            if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
                setFilesWithMetadata(imageFilesWithMetadata);
                setValue("volunteerPictures", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
                console.log("imagevolunteerPictures ", images);
                onImagesUpdate(images);

            }
        }
    }, [images, setValue, filesWithMetadata,onImagesUpdate]);



    useEffect(() => {
        if (volunteerPictures instanceof FileList) {
            setFiles(Array.from(volunteerPictures));
        } else if (Array.isArray(volunteerPictures)) {
            setFiles(volunteerPictures);
        }
    }, [volunteerPictures]);

    const handleFileChange = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("volunteerPictures", updatedFiles, { shouldValidate: true });
    };

    const handleFileRemove = async (fileToRemove: File) => {
        // Find the file in the list that matches the fileToRemove
        const matchedFile = filesWithMetadata.find(item => item.file.name === fileToRemove.name);
    
        if (matchedFile) {
            console.log("Removing file with matching imageData:", matchedFile.imageData);
            
            // Call the fetchDeleteStudent function and await its result
            const response = await fetchDeleteStudent(matchedFile.imageData);
            
            // Optionally handle the response after deletion
            if (response.success) {
                console.log("File deleted successfully:", matchedFile.file.name);
            } else {
                console.error("Failed to delete file:", response.error);
            }
        } else {
            console.log("No matching imageData found for file:", fileToRemove.name);
        }
    
        // Update the local file state after the deletion attempt
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        setValue("volunteerPictures", updatedFiles, { shouldValidate: true });
    };
    const validateFiles = () => {
        if (files.length < 2) {
            setFileError("กรุณาอัพโหลดรูปอย่างน้อย 2 รูป");
            return false;
        }
        setFileError(null);
        return true;
    };

    const onSubmit = (data: Student) => {
        if (!validateFiles()) return;

        console.log("Form Data: ", data);
        console.log("Uploaded Files: ", data.volunteerPictures);


        // Proceed with form submission logic
    };


    return (
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
            <Typography color="secondary" align="center" sx={{ mt: 2 }}>
                ภาพทำจิตอาสา 1-5 รูป เป็นจิอาสาที่ทำย้อนหลังไม่เกิน 1 ปี
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
                    {errors && (
                        <FormHelperText error>{fileError}</FormHelperText>
                    )}
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
                                        src={URL.createObjectURL(file)} // Use the local URL for the file
                                        alt={file.name}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 1,
                                            boxShadow: 1,
                                        }}
                                    />
                                    {/* <Typography variant="caption" align="center">{file.name}</Typography> */}
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

export default StudentTwelveImg;