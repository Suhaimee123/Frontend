import { Student } from "@/types/Register";
import { Box, Grid, Typography, FormHelperText } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomFileUpload from "@/components/CustomFileUpload";

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StepTen: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
    } = formMethods;

    const studentPicture = watch("studentPicture");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (studentPicture) {
            setFiles(Array.isArray(studentPicture) ? studentPicture : Array.from(studentPicture));
        }
    }, [studentPicture]);

    const handleFileChange = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("studentPicture", updatedFiles, { shouldValidate: true });
    };

    const handleFileRemove = (fileToRemove: File) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        setValue("studentPicture", updatedFiles, { shouldValidate: true });
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
        console.log("Uploaded Files: ", data.studentPicture);

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
        </Box>
    );
};

export default StepTen;
